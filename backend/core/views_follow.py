from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User, Follow
from .serializers import UserBriefSerializer


class FollowToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        if pk == request.user.id:
            return Response({'detail': 'نمی‌توانید خودتان را دنبال کنید'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            target = User.objects.get(pk=pk, is_active=True)
        except User.DoesNotExist:
            return Response({'detail': 'کاربر یافت نشد'}, status=status.HTTP_404_NOT_FOUND)

        rel, created = Follow.objects.get_or_create(follower=request.user, following=target)
        if not created:
            rel.delete()
            return Response({
                'following': False,
                'followers_count': target.followers_set.count(),
            })
        return Response({
            'following': True,
            'followers_count': target.followers_set.count(),
        })


class FollowingListView(generics.ListAPIView):
    """لیست کسانی که کاربر فعلی دنبال می‌کند"""
    serializer_class = UserBriefSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        ids = Follow.objects.filter(follower=self.request.user).values_list('following_id', flat=True)
        return User.objects.filter(id__in=ids, is_active=True)

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['request'] = self.request
        return ctx
