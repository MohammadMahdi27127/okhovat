from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q

from .models import Post, Follow
from .serializers import PostSerializer, PostCreateSerializer
from .cache_utils import invalidate_posts_cache, invalidate_admin_stats


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
        if self.request.query_params.get('following') == '1':
            if self.request.user.is_authenticated:
                ids = Follow.objects.filter(follower=self.request.user).values_list(
                    'following_id', flat=True
                )
                qs = qs.filter(user_id__in=list(ids))
            else:
                qs = qs.none()
        user_id = self.request.query_params.get('user')
        if user_id:
            qs = qs.filter(user_id=user_id)
        q = self.request.query_params.get('q', '').strip()
        if q:
            qs = qs.filter(
                Q(title__icontains=q)
                | Q(content__icontains=q)
                | Q(user__full_name__icontains=q)
            )
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
