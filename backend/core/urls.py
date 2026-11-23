from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from . import views_follow
from . import views_growth
from . import views_posts
from . import views_notify

urlpatterns = [
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', views.MeView.as_view(), name='me'),
    path('auth/change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('auth/forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
    path('auth/reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
    path('auth/avatar/', views.AvatarUploadView.as_view(), name='avatar-upload'),

    path('posts/', views_posts.PostListCreateView.as_view(), name='post-list'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:pk>/like/', views.PostLikeToggleView.as_view(), name='post-like'),
    path('posts/<int:pk>/comments/', views.PostCommentListCreateView.as_view(), name='post-comments'),
    path('posts/<int:pk>/recommend/', views.PostRecommendToggleView.as_view(), name='post-recommend'),
    path('posts/<int:pk>/bookmark/', views.PostBookmarkToggleView.as_view(), name='post-bookmark'),

    path('growth/', views_growth.GrowthLogListCreateView.as_view(), name='growth-list'),

    path('rings/', views.RingListView.as_view(), name='ring-list'),
    path('workgroups/', views.WorkgroupListView.as_view(), name='workgroup-list'),
    path('workgroups/<slug:slug>/', views.WorkgroupDetailView.as_view(), name='workgroup-detail'),
    path('workgroups/<slug:slug>/content/', views.WorkgroupContentCreateView.as_view(), name='workgroup-content'),

    path('rankings/members/', views.MemberRankingView.as_view(), name='member-rankings'),
    path('rankings/score/', views.CoachScoreUpdateView.as_view(), name='coach-score'),

    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/follow/', views_follow.FollowToggleView.as_view(), name='user-follow'),
    path('users/<int:pk>/suspend/', views.SuspendUserView.as_view(), name='user-suspend'),
    path('following/', views_follow.FollowingListView.as_view(), name='following-list'),

    path('messages/', views.CoachMessageListCreateView.as_view(), name='message-list'),
    path('messages/<int:pk>/read/', views.CoachMessageMarkReadView.as_view(), name='message-read'),

    path('notifications/', views_notify.NotificationListView.as_view(), name='notification-list'),
    path('notifications/unread-count/', views_notify.NotificationUnreadCountView.as_view(), name='notification-unread'),
    path('notifications/read-all/', views_notify.NotificationMarkReadView.as_view(), name='notification-read-all'),
    path('notifications/<int:pk>/read/', views_notify.NotificationMarkReadView.as_view(), name='notification-read'),

    path('admin/stats/', views.AdminStatsView.as_view(), name='admin-stats'),
    path('interactions/', views.UserInteractionCreateView.as_view(), name='interaction-create'),
]
