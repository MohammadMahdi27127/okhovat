from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from django.db.models import Q

from .models import Post, PostRecommendation, CoachMessage, User
from .serializers import CoachMessageSerializer
from .views_notify import notify
from .bale_service import notify_new_message


class PostRecommendToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.select_related('user').get(pk=pk)
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

        coaches = User.objects.filter(is_active=True).filter(Q(is_coach=True) | Q(is_admin=True))[:20]
        for coach in coaches:
            notify(
                coach,
                'recommend',
                f'پیشنهاد پست از {request.user.full_name}',
                (post.title or post.content)[:120],
                link=f'/posts#{post.id}',
            )

        return Response({'recommended': True, 'recommendation_count': count})


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
        msg = serializer.save(sender=user)
        notify(
            msg.recipient,
            'message',
            f'پیام از {user.full_name}',
            msg.body[:200],
            link='/profile',
        )
        if getattr(msg.recipient, 'bale_id', None):
            notify_new_message(msg.recipient.bale_id, msg.body[:200])
