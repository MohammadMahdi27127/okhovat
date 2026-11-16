from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count, Q

from .models import (
    User, Post, PostLike, PostComment, GrowthLog,
    UserInteraction, Ring, Workgroup
)
from .serializers import (
    UserSerializer, UserBriefSerializer, PostSerializer, PostCreateSerializer,
    PostCommentSerializer, GrowthLogSerializer, UserInteractionSerializer,
    RingSerializer, WorkgroupSerializer
)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

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

    def get_object(self):
        return self.request.user


class PostListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Post.objects.select_related('user', 'related_ring', 'related_workgroup').all()
        post_type = self.request.query_params.get('type')
        if post_type:
            qs = qs.filter(post_type=post_type)
        if self.request.query_params.get('trending') == '1':
            qs = qs.filter(is_trending=True)
        return qs

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateSerializer
        return PostSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.select_related('user').all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        if not (getattr(request.user, 'is_admin', False) or post.user == request.user):
            return Response({'detail': 'اجازه حذف ندارید'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


class PostLikeToggleView(APIView):
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


class PostCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = PostCommentSerializer

    def get_queryset(self):
        return PostComment.objects.filter(post_id=self.kwargs['pk']).select_related('user')

    def perform_create(self, serializer):
        post = Post.objects.get(pk=self.kwargs['pk'])
        serializer.save(user=self.request.user, post=post)
        post.comment_count += 1
        post.save(update_fields=['comment_count'])


class GrowthLogListCreateView(generics.ListCreateAPIView):
    serializer_class = GrowthLogSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user')
        if user_id and (getattr(self.request.user, 'is_coach', False) or getattr(self.request.user, 'is_admin', False)):
            return GrowthLog.objects.filter(user_id=user_id)
        return GrowthLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RingListView(generics.ListAPIView):
    queryset = Ring.objects.all().order_by('rank', '-score')
    serializer_class = RingSerializer
    permission_classes = [permissions.AllowAny]


class WorkgroupListView(generics.ListAPIView):
    queryset = Workgroup.objects.all()
    serializer_class = WorkgroupSerializer
    permission_classes = [permissions.AllowAny]


class UserListView(generics.ListAPIView):
    serializer_class = UserBriefSerializer

    def get_queryset(self):
        qs = User.objects.filter(is_active=True)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(Q(full_name__icontains=search) | Q(group_code__icontains=search))
        return qs[:50]


class SuspendUserView(APIView):
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


class AdminStatsView(APIView):
    def get(self, request):
        if not getattr(request.user, 'is_admin', False):
            return Response({'detail': 'فقط ادمین'}, status=status.HTTP_403_FORBIDDEN)

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

        return Response({
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
        })


class UserInteractionCreateView(generics.CreateAPIView):
    serializer_class = UserInteractionSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)


class ChangePasswordView(APIView):
    def post(self, request):
        old = request.data.get('old_password')
        new = request.data.get('new_password')

        if not old or not new:
            return Response({'detail': 'رمز فعلی و جدید الزامی است'}, status=status.HTTP_400_BAD_REQUEST)

        if not request.user.check_password(old):
            return Response({'detail': 'رمز فعلی اشتباه است'}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(new)
        request.user.save()
        return Response({'detail': 'رمز با موفقیت تغییر کرد'})
