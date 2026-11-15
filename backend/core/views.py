from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Post, GrowthLog, UserInteraction
from .serializers import (
    UserSerializer, PostSerializer, GrowthLogSerializer, UserInteractionSerializer
)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        group_code = request.data.get('group_code')
        password = request.data.get('password')

        if not group_code or not password:
            return Response({'detail': 'کد گروهی و رمز عبور الزامی است'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=group_code, password=password)

        if user is None:
            return Response({'detail': 'کد گروهی یا رمز عبور اشتباه است'}, status=status.HTTP_401_UNAUTHORIZED)

        if user.is_suspended:
            return Response({'detail': 'حساب شما موقتاً تعلیق شده است'}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.select_related('user', 'related_ring', 'related_workgroup').all()
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class GrowthLogListCreateView(generics.ListCreateAPIView):
    serializer_class = GrowthLogSerializer

    def get_queryset(self):
        return GrowthLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserInteractionCreateView(generics.CreateAPIView):
    serializer_class = UserInteractionSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)
