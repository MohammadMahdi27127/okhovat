from rest_framework import serializers
from .models import User, Post, GrowthLog, UserInteraction, Ring, Workgroup


class RingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ring
        fields = ['id', 'name', 'ring_number', 'score']


class WorkgroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workgroup
        fields = ['id', 'name', 'slug', 'description', 'score']


class UserSerializer(serializers.ModelSerializer):
    ring = RingSerializer(read_only=True)
    workgroup = WorkgroupSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'group_code', 'full_name', 'avatar', 'bale_id',
            'is_admin', 'is_coach', 'is_ring_leader', 'is_workgroup_leader',
            'is_resolution_officer', 'is_concerned_member',
            'ring', 'workgroup',
            'attendance_percentage', 'activity_level',
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    related_ring = RingSerializer(read_only=True)
    related_workgroup = WorkgroupSerializer(read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'user', 'title', 'content', 'media', 'post_type',
            'related_ring', 'related_workgroup',
            'is_trending', 'like_count', 'comment_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'like_count', 'comment_count', 'created_at', 'updated_at']


class GrowthLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrowthLog
        fields = [
            'id', 'date', 'sport_hours', 'study_pages',
            'group_responsibility', 'personal_skill', 'leisure',
            'extra_data', 'created_at'
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
