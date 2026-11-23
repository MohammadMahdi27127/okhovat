from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Auth
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', views.MeView.as_view(), name='me'),
    path('auth/change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('auth/forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
    path('auth/reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
    path('auth/avatar/', views.AvatarUploadView.as_view(), name='avatar-upload'),

    # Posts
    path('posts/', views.PostListCreateView.as_view(), name='post-list'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:pk>/like/', views.PostLikeToggleView.as_view(), name='post-like'),
    path('posts/<int:pk>/comments/', views.PostCommentListCreateView.as_view(), name='post-comments'),
    path('posts/<int:pk>/recommend/', views.PostRecommendToggleView.as_view(), name='post-recommend'),
    path('posts/<int:pk>/bookmark/', views.PostBookmarkToggleView.as_view(), name='post-bookmark'),

    # Growth
    path('growth/', views.GrowthLogListCreateView.as_view(), name='growth-list'),

    # Rings & Workgroups
    path('rings/', views.RingListView.as_view(), name='ring-list'),
    path('workgroups/', views.WorkgroupListView.as_view(), name='workgroup-list'),
    path('workgroups/<slug:slug>/', views.WorkgroupDetailView.as_view(), name='workgroup-detail'),
    path('workgroups/<slug:slug>/content/', views.WorkgroupContentCreateView.as_view(), name='workgroup-content'),

    # Users
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/suspend/', views.SuspendUserView.as_view(), name='user-suspend'),

    # Coach messages
    path('messages/', views.CoachMessageListCreateView.as_view(), name='message-list'),
    path('messages/<int:pk>/read/', views.CoachMessageMarkReadView.as_view(), name='message-read'),

    # Admin
    path('admin/stats/', views.AdminStatsView.as_view(), name='admin-stats'),

    # Analytics
    path('interactions/', views.UserInteractionCreateView.as_view(), name='interaction-create'),
]
