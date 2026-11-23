from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.utils import timezone

from .models import GrowthLog, Post
from .serializers import GrowthLogSerializer
from .cache_utils import invalidate_posts_cache, invalidate_admin_stats
from .views import _truthy, _growth_post_body


class GrowthLogListCreateView(generics.ListCreateAPIView):
    serializer_class = GrowthLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        user_id = self.request.query_params.get('user')
        if user_id and (
            getattr(self.request.user, 'is_coach', False)
            or getattr(self.request.user, 'is_admin', False)
        ):
            return GrowthLog.objects.filter(user_id=user_id)
        return GrowthLog.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        data = request.data
        user = request.user

        date = data.get('date') or timezone.now().date().isoformat()
        try:
            sport_hours = float(data.get('sport_hours') or 0)
        except (TypeError, ValueError):
            sport_hours = 0
        try:
            study_pages = int(float(data.get('study_pages') or 0))
        except (TypeError, ValueError):
            study_pages = 0

        group_responsibility = data.get('group_responsibility') or ''
        personal_skill = data.get('personal_skill') or ''
        leisure = data.get('leisure') or ''

        extra = data.get('extra_data')
        if isinstance(extra, str):
            import json
            try:
                extra = json.loads(extra)
            except Exception:
                extra = {}
        if not isinstance(extra, dict):
            extra = {}

        publish = _truthy(data.get('publish_to_posts')) or _truthy(data.get('publish')) or _truthy(
            extra.get('publish_to_posts')
        )
        extra['publish_to_posts'] = publish

        skill_doc = request.FILES.get('skill_document')

        defaults = {
            'sport_hours': sport_hours,
            'study_pages': study_pages,
            'group_responsibility': group_responsibility,
            'personal_skill': personal_skill,
            'leisure': leisure,
            'extra_data': extra,
        }
        if skill_doc:
            defaults['skill_document'] = skill_doc

        log, created = GrowthLog.objects.update_or_create(
            user=user,
            date=date,
            defaults=defaults,
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

        out = GrowthLogSerializer(log, context={'request': request}).data
        return Response(
            {
                **out,
                'created': created,
                'published_to_posts': bool(published_post),
                'post_id': published_post.id if published_post else None,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
