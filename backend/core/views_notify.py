from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'kind', 'title', 'body', 'link', 'is_read', 'created_at']
        read_only_fields = fields


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)[:50]


class NotificationUnreadCountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({'count': count})


class NotificationMarkReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk=None):
        if pk:
            updated = Notification.objects.filter(user=request.user, pk=pk, is_read=False).update(is_read=True)
            return Response({'updated': updated})
        updated = Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'updated': updated})


def notify(user, kind: str, title: str, body: str = '', link: str = ''):
    if not user:
        return None
    return Notification.objects.create(
        user=user,
        kind=kind,
        title=title[:200],
        body=body or '',
        link=link or '',
    )
