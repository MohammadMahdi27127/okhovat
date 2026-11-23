from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Ring, Workgroup, Post, PostLike, PostComment,
    PostRecommendation, GrowthLog, UserInteraction, Reel, AIUsageLog,
    CoachMessage,
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('group_code', 'full_name', 'ring', 'workgroup', 'is_coach', 'is_admin', 'is_active')
    list_filter = ('is_coach', 'is_admin', 'is_ring_leader', 'is_workgroup_leader', 'is_active')
    search_fields = ('group_code', 'full_name')
    ordering = ('group_code',)

    fieldsets = (
        (None, {'fields': ('group_code', 'password')}),
        ('اطلاعات شخصی', {'fields': ('full_name', 'avatar', 'bale_id')}),
        ('نقش‌ها', {'fields': ('is_admin', 'is_coach', 'is_ring_leader', 'is_workgroup_leader', 'is_resolution_officer', 'is_concerned_member')}),
        ('تشکیلات', {'fields': ('ring', 'workgroup')}),
        ('وضعیت', {'fields': ('attendance_percentage', 'activity_level', 'suspended_until', 'is_active', 'is_staff')}),
        ('دسترسی‌ها', {'fields': ('groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('group_code', 'full_name', 'password1', 'password2'),
        }),
    )


@admin.register(CoachMessage)
class CoachMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'is_read', 'created_at')
    list_filter = ('is_read',)
    search_fields = ('body', 'sender__full_name', 'recipient__full_name')


admin.site.register(Ring)
admin.site.register(Workgroup)
admin.site.register(Post)
admin.site.register(GrowthLog)
admin.site.register(UserInteraction)
admin.site.register(Reel)
admin.site.register(AIUsageLog)
