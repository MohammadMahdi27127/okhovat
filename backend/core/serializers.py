from rest_framework import serializers
from .models import (
    User, Post, PostLike, PostComment, PostRecommendation, PostBookmark,
    GrowthLog, UserInteraction, Ring, Workgroup, CircleScoreLog,
    CoachMessage, Follow,
)


class RingSerializer(serializers.ModelSerializer):
    members_count = serializers.SerializerMethodField()

    class Meta:
        model = Ring
        fields = [
            'id', 'name', 'ring_number', 'score', 'coach_score',
            'attendance_avg', 'external_likes', 'rank', 'members_count'
        ]

    def get_members_count(self, obj):
        return obj.members.count()


class WorkgroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workgroup
        fields = ['id', 'name', 'slug', 'description', 'score']


class UserSerializer(serializers.ModelSerializer):
    ring = RingSerializer(read_only=True)
    workgroup = WorkgroupSerializer(read_only=True)
    posts_count = serializers.SerializerMethodField()
    growth_logs_count = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'group_code', 'full_name', 'avatar', 'bale_id',
            'is_admin', 'is_coach', 'is_ring_leader', 'is_workgroup_leader',
            'is_resolution_officer', 'is_concerned_member',
            'ring', 'workgroup',
            'attendance_percentage', 'activity_level',
            'sport_plan', 'book_plan',
            'posts_count', 'growth_logs_count',
            'followers_count', 'following_count',
            'is_active', 'created_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'posts_count', 'growth_logs_count',
            'followers_count', 'following_count',
        ]

    def get_posts_count(self, obj):
        return obj.posts.count()

    def get_growth_logs_count(self, obj):
        return obj.growth_logs.count()

    def get_followers_count(self, obj):
        return obj.followers_set.count()

    def get_following_count(self, obj):
        return obj.following_set.count()


class UserBriefSerializer(serializers.ModelSerializer):
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'full_name', 'group_code', 'avatar', 'is_following']

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user.id != obj.id:
            return Follow.objects.filter(follower=request.user, following=obj).exists()
        return False


class PostSerializer(serializers.ModelSerializer):
    user = UserBriefSerializer(read_only=True)
    related_ring = RingSerializer(read_only=True)
    related_workgroup = WorkgroupSerializer(read_only=True)
    is_liked = serializers.SerializerMethodField()
    is_recommended = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    recommendation_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'user', 'title', 'content', 'media', 'post_type',
            'related_ring', 'related_workgroup',
            'is_trending', 'like_count', 'comment_count',
            'is_liked', 'is_recommended', 'is_bookmarked',
            'recommendation_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'like_count', 'comment_count',
            'created_at', 'updated_at',
        ]

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return PostLike.objects.filter(post=obj, user=request.user).exists()
        return False

    def get_is_recommended(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return PostRecommendation.objects.filter(
                post=obj, recommended_by=request.user
            ).exists()
        return False

    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return PostBookmark.objects.filter(post=obj, user=request.user).exists()
        return False

    def get_recommendation_count(self, obj):
        return obj.recommendations.count()


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['title', 'content', 'media', 'post_type', 'related_ring', 'related_workgroup']


class PostCommentSerializer(serializers.ModelSerializer):
    user = UserBriefSerializer(read_only=True)

    class Meta:
        model = PostComment
        fields = ['id', 'user', 'content', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class GrowthLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrowthLog
        fields = [
            'id', 'date', 'sport_hours', 'study_pages',
            'group_responsibility', 'personal_skill', 'leisure',
            'skill_document', 'extra_data', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UserInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInteraction
        fields = [
            'id', 'session_id', 'page', 'section',
            'element_type', 'element_id', 'action', 'metadata', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class CircleScoreLogSerializer(serializers.ModelSerializer):
    ring_name = serializers.CharField(source='ring.name', read_only=True)

    class Meta:
        model = CircleScoreLog
        fields = [
            'id', 'ring', 'ring_name', 'week_start',
            'coach_score', 'attendance_avg', 'external_likes',
            'total_score', 'rank', 'created_at'
        ]


class CoachMessageSerializer(serializers.ModelSerializer):
    sender = UserBriefSerializer(read_only=True)
    recipient = UserBriefSerializer(read_only=True)
    recipient_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_active=True),
        source='recipient',
        write_only=True,
    )

    class Meta:
        model = CoachMessage
        fields = [
            'id', 'sender', 'recipient', 'recipient_id',
            'body', 'is_read', 'created_at',
        ]
        read_only_fields = ['id', 'sender', 'is_read', 'created_at']
