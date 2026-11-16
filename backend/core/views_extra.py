"""
ویوهای تکمیلی: بازیابی رمز، آپلود آواتار، محتوای کارگروه
"""
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.files.uploadedfile import UploadedFile

from .models import User, PasswordResetOTP, Workgroup, WorkgroupContent
from .serializers import UserSerializer, WorkgroupSerializer
from .bale_service import send_otp_code

MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # ۱۰ مگابایت


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        group_code = request.data.get('group_code', '').strip()
        if not group_code:
            return Response({'detail': 'کد گروهی الزامی است'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(group_code=group_code, is_active=True)
        except User.DoesNotExist:
            # برای امنیت، پیام یکسان
            return Response({'detail': 'اگر کد گروهی معتبر باشد، کد به بله ارسال شد.'})

        if not user.bale_id:
            return Response(
                {'detail': 'آیدی بله برای این کاربر ثبت نشده. با ادمین تماس بگیرید.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        otp = PasswordResetOTP.generate_for_user(user)
        sent = send_otp_code(user.bale_id, otp.code)

        return Response({
            'detail': 'اگر کد گروهی معتبر باشد، کد به بله ارسال شد.',
            'sent': sent,  # در حالت BALE_ENABLED=False برابر False است
        })


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        group_code = request.data.get('group_code', '').strip()
        code = request.data.get('code', '').strip()
        new_password = request.data.get('new_password', '')

        if not all([group_code, code, new_password]):
            return Response({'detail': 'کد گروهی، کد تأیید و رمز جدید الزامی است'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 6:
            return Response({'detail': 'رمز جدید باید حداقل ۶ کاراکتر باشد'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(group_code=group_code, is_active=True)
        except User.DoesNotExist:
            return Response({'detail': 'کد نامعتبر است'}, status=status.HTTP_400_BAD_REQUEST)

        otp = PasswordResetOTP.objects.filter(user=user, code=code, is_used=False).first()
        if not otp or not otp.is_valid():
            return Response({'detail': 'کد نامعتبر یا منقضی شده است'}, status=status.HTTP_400_BAD_REQUEST)

        otp.is_used = True
        otp.save(update_fields=['is_used'])

        user.set_password(new_password)
        user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'detail': 'رمز با موفقیت تغییر کرد',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        })


class AvatarUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get('avatar')
        if not file:
            return Response({'detail': 'فایل آواتار الزامی است'}, status=status.HTTP_400_BAD_REQUEST)

        if file.size > MAX_UPLOAD_SIZE:
            return Response({'detail': 'حجم فایل حداکثر ۱۰ مگابایت است'}, status=status.HTTP_400_BAD_REQUEST)

        allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if file.content_type not in allowed:
            return Response({'detail': 'فرمت مجاز: jpg, png, webp, gif'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if user.avatar:
            user.avatar.delete(save=False)
        user.avatar = file
        user.save(update_fields=['avatar'])

        return Response({
            'detail': 'آواتار به‌روز شد',
            'avatar': user.avatar.url if user.avatar else None,
            'user': UserSerializer(user).data,
        })


class WorkgroupDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        try:
            wg = Workgroup.objects.get(slug=slug)
        except Workgroup.DoesNotExist:
            return Response({'detail': 'کارگروه یافت نشد'}, status=status.HTTP_404_NOT_FOUND)

        contents = WorkgroupContent.objects.filter(workgroup=wg, is_published=True)[:20]
        content_list = [{
            'id': c.id,
            'title': c.title,
            'body': c.body,
            'media': c.media.url if c.media else None,
            'data': c.data,
            'created_at': c.created_at,
            'created_by': c.created_by.full_name if c.created_by else None,
        } for c in contents]

        return Response({
            'workgroup': WorkgroupSerializer(wg).data,
            'contents': content_list,
        })


class WorkgroupContentCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request, slug):
        try:
            wg = Workgroup.objects.get(slug=slug)
        except Workgroup.DoesNotExist:
            return Response({'detail': 'کارگروه یافت نشد'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        is_leader = (
            user.is_admin or
            (user.is_workgroup_leader and user.workgroup_id == wg.id)
        )
        if not is_leader:
            return Response({'detail': 'فقط مسئول این کارگروه یا ادمین'}, status=status.HTTP_403_FORBIDDEN)

        title = request.data.get('title', '')
        body = request.data.get('body', '')
        data_raw = request.data.get('data', '{}')
        if isinstance(data_raw, str):
            import json
            try:
                data = json.loads(data_raw) if data_raw else {}
            except json.JSONDecodeError:
                data = {}
        else:
            data = data_raw or {}

        media = request.FILES.get('media')
        if media and media.size > MAX_UPLOAD_SIZE:
            return Response({'detail': 'حجم فایل حداکثر ۱۰ مگابایت است'}, status=status.HTTP_400_BAD_REQUEST)

        content = WorkgroupContent.objects.create(
            workgroup=wg,
            created_by=user,
            title=title,
            body=body,
            data=data,
            media=media,
        )

        return Response({
            'id': content.id,
            'title': content.title,
            'body': content.body,
            'media': content.media.url if content.media else None,
            'data': content.data,
            'created_at': content.created_at,
        }, status=status.HTTP_201_CREATED)
