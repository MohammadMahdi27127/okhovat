from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.throttling import AnonRateThrottle
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count, Q, Sum, Avg

from .models import (
    User, Post, PostLike, PostComment, GrowthLog,
    UserInteraction, Ring, Workgroup, CoachMessage,
    PostRecommendation, PostBookmark,
)
from .serializers import (
    UserSerializer, UserBriefSerializer, PostSerializer, PostCreateSerializer,
    PostCommentSerializer, GrowthLogSerializer, UserInteractionSerializer,
    RingSerializer, WorkgroupSerializer, CoachMessageSerializer,
)
from .cache_utils import (
    cache_get, cache_set,
    CACHE_RINGS, CACHE_WORKGROUPS, CACHE_ADMIN_STATS,
    invalidate_posts_cache, invalidate_rings_cache, invalidate_admin_stats,
)

from .views_extra import (
    ForgotPasswordView,
    ResetPasswordView,
    AvatarUploadView,
    WorkgroupDetailView,
    WorkgroupContentCreateView,
)


class LoginRateThrottle(AnonRateThrottle):
    rate = '5/min'


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        group_code = request.data.get('group_code')
        password = request.data.get('password')

        if not group_code or not password:
            return Response({'detail': 'کد گروهی و رمز عبور الزامی است'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=group_code, password=password)

        if user is None:
            return Response({'detail': 'کد گروهی یا رمز عبور اشتباه است'}, status=status.HTTP_401_UNAUTHORIZED)

        if hasattr(user, 'is_suspended') and user.is_suspended:
            return Response({'detail': 'حساب شما موقتاً تعلیق شده است'}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class PostListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        qs = Post.objects.select_related('user', 'related_ring', 'related_workgroup').all()
        post_type = self.request.query_params.get('type')
        if post_type:
            qs = qs.filter(post_type=post_type)
        if self.request.query_params.get('trending') == '1':
            qs = qs.filter(Q(is_trending=True) | Q(recommendations__isnull=False)).distinct()
        return qs

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateSerializer
        return PostSerializer

    def perform_create(self, serializer):
        media = self.request.FILES.get('media')
        if media and media.size > 10 * 1024 * 1024:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'media': 'حجم فایل حداکثر ۱۰ مگابایت است'})
        serializer.save(user=self.request.user, media=media)
        invalidate_posts_cache()
        invalidate_admin_stats()

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.select_related('user').all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def update(self, request, *args, **kwargs):
        post = self.get_object()
        if not (getattr(request.user, 'is_admin', False) or post.user == request.user):
            return Response({'detail': 'اجازه ویرایش ندارید'}, status=status.HTTP_403_FORBIDDEN)
        response = super().update(request, *args, **kwargs)
        invalidate_posts_cache()
        return response

    def partial_update(self, request, *args, **kwargs):
        post = self.get_object()
        if not (getattr(request.user, 'is_admin', False) or post.user == request.user):
            return Response({'detail': 'اجازه ویرایش ندارید'}, status=status.HTTP_403_FORBIDDEN)
        response = super().partial_update(request, *args, **kwargs)
        invalidate_posts_cache()
        return response

    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        if not (getattr(request.user, 'is_admin', False) or post.user == request.user):
            return Response({'detail': 'اجازه حذف ندارید'}, status=status.HTTP_403_FORBIDDEN)
        response = super().destroy(request, *args, **kwargs)
        invalidate_posts_cache()
        invalidate_admin_stats()
        return response


class PostLikeToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({'detail': 'پست یافت نشد'}, status=status.HTTP_404_NOT_FOUND)

        like, created = PostLike.objects.get_or_create(post=post, user=request.user)
        if not created:
            like.delete()
            post.like_count = max(0, post.like_count - 1)
            post.save(update_fields=['like_count'])
            return Response({'liked': False, 'like_count': post.like_count})

        post.like_count += 1
        post.save(update_fields=['like_count'])
        return Response({'liked': True, 'like_count': post.like_count})


class PostRecommendToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({'detail': 'پست یافت نشد'}, status=status.HTTP_404_NOT_FOUND)

        rec, created = PostRecommendation.objects.get_or_create(
            post=post, recommended_by=request.user
        )
        if not created:
            rec.delete()
            count = post.recommendations.count()
            if count == 0 and post.is_trending:
                post.is_trending = False
                post.save(update_fields=['is_trending'])
            return Response({'recommended': False, 'recommendation_count': count})

        count = post.recommendations.count()
        if count >= 1 and not post.is_trending:
            post.is_trending = True
            post.save(update_fields=['is_trending'])
        return Response({'recommended': True, 'recommendation_count': count})


class PostBookmarkToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({'detail': 'پست یافت نشد'}, status=status.HTTP_404_NOT_FOUND)

        bm, created = PostBookmark.objects.get_or_create(post=post, user=request.user)
        if not created:
            bm.delete()
            return Response({'bookmarked': False})
        return Response({'bookmarked': True})


class PostCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = PostCommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return PostComment.objects.filter(post_id=self.kwargs['pk']).select_related('user')

    def perform_create(self, serializer):
        post = Post.objects.get(pk=self.kwargs['pk'])
        serializer.save(user=self.request.user, post=post)
        post.comment_count += 1
        post.save(update_fields=['comment_count'])


def _truthy(val):
    return val in (True, 'true', 'True', '1', 1, 'yes')


def _growth_post_body(log: GrowthLog) -> str:
    parts = []
    if log.sport_hours:
        parts.append(f'🏋️ ورزش: {log.sport_hours} ساعت')
    if log.study_pages:
        parts.append(f'📚 مطالعه: {log.study_pages} صفحه')
    if log.personal_skill:
        parts.append(f'💡 مهارت: {log.personal_skill}')
    if log.group_responsibility:
        parts.append(f'👥 مسئولیت گروهی: {log.group_responsibility}')
    if log.leisure:
        parts.append(f'☕ اوقات فراغت: {log.leisure}')
    if not parts:
        parts.append('گزارش رشد امروز ثبت شد.')
    return '\n'.join(parts)


class GrowthLogListCreateView(generics.ListCreateAPIView):
    serializer_class = GrowthLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.query_params.get('user')
        if user_id and (getattr(self.request.user, 'is_coach', False) or getattr(self.request.user, 'is_admin', False)):
            return GrowthLog.objects.filter(user_id=user_id)
        return GrowthLog.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = request.user
        date = data.get('date')

        extra = data.get('extra_data') or {}
        if not isinstance(extra, dict):
            extra = {}
        publish = _truthy(request.data.get('publish_to_posts')) or _truthy(
            request.data.get('publish')
        ) or _truthy(extra.get('publish_to_posts'))
        extra['publish_to_posts'] = publish

        log, created = GrowthLog.objects.update_or_create(
            user=user,
            date=date,
            defaults={
                'sport_hours': data.get('sport_hours') or 0,
                'study_pages': data.get('study_pages') or 0,
                'group_responsibility': data.get('group_responsibility') or '',
                'personal_skill': data.get('personal_skill') or '',
                'leisure': data.get('leisure') or '',
                'extra_data': extra,
            },
        )

        published_post = None
        if publish:
            body = _growth_post_body(log)
            title = f'گزارش رشد · {log.date}'
            published_post = Post.objects.create(
                user=user,
                title=title,
                content=body,
                post_type='growth',
            )
            invalidate_posts_cache()

        invalidate_admin_stats()

        out = GrowthLogSerializer(log).data
        response_data = {
            **out,
            'created': created,
            'published_to_posts': bool(published_post),
            'post_id': published_post.id if published_post else None,
        }
        return Response(
            response_data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class RingListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cached = cache_get(CACHE_RINGS)
        if cached is not None:
            return Response(cached)

        qs = Ring.objects.all().order_by('rank', '-score')
        data = RingSerializer(qs, many=True).data
        cache_set(CACHE_RINGS, data, timeout=120)
        return Response(data)


class WorkgroupListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cached = cache_get(CACHE_WORKGROUPS)
        if cached is not None:
            return Response(cached)

        qs = Workgroup.objects.all()
        data = WorkgroupSerializer(qs, many=True).data
        cache_set(CACHE_WORKGROUPS, data, timeout=300)
        return Response(data)


class MemberRankingView(APIView):
    """رتبه‌بندی اعضا بر اساس ورزش / مطالعه / حضور"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        field = request.query_params.get('field', 'sport')
        if field not in ('sport', 'study', 'attendance'):
            field = 'sport'
        try:
            days = int(request.query_params.get('days', 7))
        except (TypeError, ValueError):
            days = 7
        days = max(1, min(days, 90))
        try:
            limit = int(request.query_params.get('limit', 10))
        except (TypeError, ValueError):
            limit = 10
        limit = max(1, min(limit, 50))

        since = timezone.now().date() - timedelta(days=days)

        if field == 'attendance':
            users = list(
                User.objects.filter(is_active=True)
                .order_by('-attendance_percentage')[: limit * 3]
            )
            ranked = [
                {
                    'id': u.id,
                    'full_name': u.full_name,
                    'group_code': u.group_code,
                    'value': round(float(u.attendance_percentage or 0), 1),
                    'unit': '%',
                }
                for u in users
            ]
        else:
            metric = 'sport_hours' if field == 'sport' else 'study_pages'
            unit = 'ساعت' if field == 'sport' else 'صفحه'
            rows = (
                GrowthLog.objects.filter(date__gte=since)
                .values('user_id')
                .annotate(total=Sum(metric))
                .order_by('-total')
            )
            user_ids = [r['user_id'] for r in rows if r['total']]
            users_map = {
                u.id: u
                for u in User.objects.filter(id__in=user_ids, is_active=True)
            }
            ranked = []
            for r in rows:
                u = users_map.get(r['user_id'])
                if not u:
                    continue
                ranked.append({
                    'id': u.id,
                    'full_name': u.full_name,
                    'group_code': u.group_code,
                    'value': round(float(r['total'] or 0), 1),
                    'unit': unit,
                })

        top = ranked[:limit]
        bottom = list(reversed(ranked[-limit:])) if len(ranked) > limit else list(reversed(ranked))

        return Response({
            'field': field,
            'days': days,
            'top': top,
            'bottom': bottom,
            'total_ranked': len(ranked),
        })


class CoachScoreUpdateView(APIView):
    """ثبت امتیاز مربی برای حلقه یا کارگروه"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not (getattr(request.user, 'is_coach', False) or getattr(request.user, 'is_admin', False)):
            return Response({'detail': 'فقط مربی یا ادمین'}, status=status.HTTP_403_FORBIDDEN)

        target = request.data.get('target')
        try:
            target_id = int(request.data.get('id'))
        except (TypeError, ValueError):
            return Response({'detail': 'شناسه نامعتبر'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            score = float(request.data.get('score', 0))
        except (TypeError, ValueError):
            return Response({'detail': 'امتیاز نامعتبر'}, status=status.HTTP_400_BAD_REQUEST)
        score = max(0.0, min(score, 10.0))

        if target == 'ring':
            try:
                ring = Ring.objects.get(pk=target_id)
            except Ring.DoesNotExist:
                return Response({'detail': 'حلقه یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
            ring.coach_score = score
            ring.recalculate_score()
            all_rings = list(Ring.objects.order_by('-score', 'ring_number'))
            for i, r in enumerate(all_rings, start=1):
                if r.rank != i:
                    r.rank = i
                    r.save(update_fields=['rank'])
            try:
                invalidate_rings_cache()
            except Exception:
                pass
            return Response({
                'target': 'ring',
                'id': ring.id,
                'name': ring.name,
                'coach_score': ring.coach_score,
                'score': ring.score,
                'rank': ring.rank,
            })

        if target == 'workgroup':
            try:
                wg = Workgroup.objects.get(pk=target_id)
            except Workgroup.DoesNotExist:
                return Response({'detail': 'کارگروه یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
            wg.score = score
            wg.save(update_fields=['score'])
            try:
                cache_set(CACHE_WORKGROUPS, None, timeout=1)
            except Exception:
                pass
            return Response({
                'target': 'workgroup',
                'id': wg.id,
                'name': wg.name,
                'score': wg.score,
            })

        return Response({'detail': 'target باید ring یا workgroup باشد'}, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    serializer_class = UserBriefSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = User.objects.filter(is_active=True)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(Q(full_name__icontains=search) | Q(group_code__icontains=search))
        return qs[:50]


class SuspendUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        if not getattr(request.user, 'is_admin', False):
            return Response({'detail': 'فقط ادمین'}, status=status.HTTP_403_FORBIDDEN)

        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'detail': 'کاربر یافت نشد'}, status=status.HTTP_404_NOT_FOUND)

        days = int(request.data.get('days', 1))
        if days not in (1, 3):
            days = 1

        user.suspended_until = timezone.now() + timedelta(days=days)
        user.save(update_fields=['suspended_until'])
        return Response({'detail': f'کاربر به مدت {days} روز تعلیق شد'})


class CoachMessageListCreateView(generics.ListCreateAPIView):
    serializer_class = CoachMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = CoachMessage.objects.select_related('sender', 'recipient')
        role_coach = getattr(user, 'is_coach', False) or getattr(user, 'is_admin', False)
        inbox = self.request.query_params.get('inbox')
        recipient_id = self.request.query_params.get('recipient')

        if role_coach and inbox != '1':
            qs = qs.filter(sender=user)
            if recipient_id:
                qs = qs.filter(recipient_id=recipient_id)
            return qs
        return qs.filter(recipient=user)

    def perform_create(self, serializer):
        user = self.request.user
        if not (getattr(user, 'is_coach', False) or getattr(user, 'is_admin', False)):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('فقط مربی یا ادمین می‌تواند پیام بفرستد')
        serializer.save(sender=user)


class CoachMessageMarkReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            msg = CoachMessage.objects.get(pk=pk, recipient=request.user)
        except CoachMessage.DoesNotExist:
            return Response({'detail': 'پیام یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
        msg.is_read = True
        msg.save(update_fields=['is_read'])
        return Response({'detail': 'خوانده شد', 'id': msg.id, 'is_read': True})


class AdminStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not getattr(request.user, 'is_admin', False):
            return Response({'detail': 'فقط ادمین'}, status=status.HTTP_403_FORBIDDEN)

        cached = cache_get(CACHE_ADMIN_STATS)
        if cached is not None:
            return Response(cached)

        week_ago = timezone.now().date() - timedelta(days=7)

        growth_users = GrowthLog.objects.filter(date__gte=week_ago).values('user').annotate(
            nights=Count('id')
        ).order_by('-nights')

        filled = []
        for item in growth_users:
            try:
                u = User.objects.get(pk=item['user'])
                filled.append({'name': u.full_name, 'nights': item['nights']})
            except User.DoesNotExist:
                pass

        filled_ids = [item['user'] for item in growth_users]
        empty = list(
            User.objects.filter(is_active=True).exclude(id__in=filled_ids)
            .values_list('full_name', flat=True)[:20]
        )

        wg_meetings = Post.objects.filter(
            post_type='workgroup_meeting',
            created_at__gte=timezone.now() - timedelta(days=7)
        ).values('related_workgroup__name').annotate(count=Count('id'))

        circle_programs = Post.objects.filter(
            post_type='circle_program',
            created_at__gte=timezone.now() - timedelta(days=7)
        ).values('related_ring__name').annotate(count=Count('id'))

        data = {
            'growth_filled': filled,
            'growth_empty': empty,
            'workgroup_meetings': [
                {'name': w['related_workgroup__name'] or 'نامشخص', 'count': w['count']}
                for w in wg_meetings
            ],
            'circle_programs': [
                {'name': c['related_ring__name'] or 'نامشخص', 'count': c['count']}
                for c in circle_programs
            ],
        }
        cache_set(CACHE_ADMIN_STATS, data, timeout=60)
        return Response(data)


class UserInteractionCreateView(generics.CreateAPIView):
    serializer_class = UserInteractionSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        old = request.data.get('old_password')
        new = request.data.get('new_password')

        if not old or not new:
            return Response({'detail': 'رمز فعلی و جدید الزامی است'}, status=status.HTTP_400_BAD_REQUEST)

        if not request.user.check_password(old):
            return Response({'detail': 'رمز فعلی اشتباه است'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new) < 6:
            return Response({'detail': 'رمز جدید باید حداقل ۶ کاراکتر باشد'}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(new)
        request.user.save()
        return Response({'detail': 'رمز با موفقیت تغییر کرد'})
