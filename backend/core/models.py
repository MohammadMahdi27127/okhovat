from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.db.models import Avg
import random


class UserManager(BaseUserManager):
    def create_user(self, group_code, full_name, password=None, **extra_fields):
        if not group_code:
            raise ValueError('کد گروهی الزامی است')
        user = self.model(
            group_code=str(group_code).strip(),
            full_name=full_name.strip(),
            **extra_fields
        )
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, group_code, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin', True)
        return self.create_user(group_code, full_name, password, **extra_fields)


class Ring(models.Model):
    name = models.CharField(max_length=100, verbose_name='نام حلقه')
    ring_number = models.PositiveSmallIntegerField(unique=True, verbose_name='شماره حلقه')
    score = models.FloatField(default=0, verbose_name='امتیاز کل حلقه')
    coach_score = models.FloatField(default=0, verbose_name='آخرین امتیاز مربی')
    attendance_avg = models.FloatField(default=0, verbose_name='میانگین درصد حضور')
    external_likes = models.PositiveIntegerField(default=0, verbose_name='لایک‌های خارج از حلقه')
    rank = models.PositiveSmallIntegerField(default=0, verbose_name='رتبه فعلی')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'حلقه'
        verbose_name_plural = 'حلقه‌ها'
        ordering = ['rank', 'ring_number']

    def __str__(self):
        return f'حلقه {self.ring_number} - {self.name}'

    def recalculate_score(self):
        self.score = (self.coach_score * 2) + (self.attendance_avg * 2) + self.external_likes
        self.save(update_fields=['score', 'updated_at'])
        return self.score

    def update_attendance_avg(self):
        avg = self.members.aggregate(avg=Avg('attendance_percentage'))['avg'] or 0
        self.attendance_avg = round(avg, 1)
        self.save(update_fields=['attendance_avg'])
        self.recalculate_score()


class CircleScoreLog(models.Model):
    ring = models.ForeignKey(Ring, on_delete=models.CASCADE, related_name='score_logs')
    week_start = models.DateField(verbose_name='شروع هفته')
    coach_score = models.FloatField(default=0)
    attendance_avg = models.FloatField(default=0)
    external_likes = models.PositiveIntegerField(default=0)
    total_score = models.FloatField(default=0)
    rank = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'لاگ امتیاز حلقه'
        verbose_name_plural = 'لاگ‌های امتیاز حلقه'
        ordering = ['-week_start', 'rank']
        unique_together = ('ring', 'week_start')


class Workgroup(models.Model):
    name = models.CharField(max_length=100, verbose_name='نام کارگروه')
    slug = models.SlugField(max_length=50, unique=True, null=True, blank=True)
    description = models.TextField(blank=True, verbose_name='توضیحات')
    score = models.FloatField(default=0, verbose_name='امتیاز کارگروه')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'کارگروه'
        verbose_name_plural = 'کارگروه‌ها'

    def __str__(self):
        return self.name


class WorkgroupContent(models.Model):
    """محتوای قابل نمایش در صفحه کارگروه (ثبت‌شده توسط مسئول)"""
    workgroup = models.ForeignKey(Workgroup, on_delete=models.CASCADE, related_name='contents')
    created_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=200, blank=True)
    body = models.TextField(blank=True)
    media = models.FileField(upload_to='workgroups/', null=True, blank=True)
    data = models.JSONField(default=dict, blank=True)  # لیست افراد، هزینه‌ها و ...
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'محتوای کارگروه'


class User(AbstractBaseUser, PermissionsMixin):
    group_code = models.CharField(max_length=50, unique=True, verbose_name='کد گروهی')
    full_name = models.CharField(max_length=150, verbose_name='نام و نام خانوادگی')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True, verbose_name='آواتار')
    bale_id = models.CharField(max_length=100, blank=True, null=True, verbose_name='آیدی بله')

    is_admin = models.BooleanField(default=False, verbose_name='مدیر سایت')
    is_coach = models.BooleanField(default=False, verbose_name='مربی')
    is_ring_leader = models.BooleanField(default=False, verbose_name='سر حلقه')
    is_workgroup_leader = models.BooleanField(default=False, verbose_name='مسئول کارگروه')
    is_resolution_officer = models.BooleanField(default=False, verbose_name='مسئول مصوبات')
    is_concerned_member = models.BooleanField(default=False, verbose_name='عضو دغدغه‌مندان')

    ring = models.ForeignKey(Ring, on_delete=models.SET_NULL, null=True, blank=True, related_name='members', verbose_name='حلقه')
    workgroup = models.ForeignKey(Workgroup, on_delete=models.SET_NULL, null=True, blank=True, related_name='members', verbose_name='کارگروه')

    attendance_percentage = models.FloatField(default=0, verbose_name='درصد حضور')
    activity_level = models.PositiveSmallIntegerField(default=1, verbose_name='سطح فعالیت')
    suspended_until = models.DateTimeField(null=True, blank=True, verbose_name='تعلیق تا تاریخ')

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'group_code'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        verbose_name = 'کاربر'
        verbose_name_plural = 'کاربران'

    def __str__(self):
        return f'{self.full_name} ({self.group_code})'

    @property
    def is_suspended(self):
        if self.suspended_until and self.suspended_until > timezone.now():
            return True
        return False


class PasswordResetOTP(models.Model):
    """کد ۴ رقمی بازیابی رمز از طریق بله"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_otps')
    code = models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    @classmethod
    def generate_for_user(cls, user):
        code = f'{random.randint(0, 9999):04d}'
        return cls.objects.create(user=user, code=code)

    def is_valid(self):
        if self.is_used:
            return False
        return timezone.now() - self.created_at < timezone.timedelta(minutes=5)


class Post(models.Model):
    POST_TYPES = (
        ('normal', 'عادی'),
        ('circle_program', 'برنامه حلقه'),
        ('workgroup_meeting', 'جلسه کارگروه'),
        ('growth', 'رشد فردی'),
        ('coach', 'پست مربی'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts', verbose_name='نویسنده')
    title = models.CharField(max_length=255, blank=True, verbose_name='عنوان')
    content = models.TextField(verbose_name='محتوا')
    media = models.FileField(upload_to='posts/', null=True, blank=True, verbose_name='رسانه')
    post_type = models.CharField(max_length=30, choices=POST_TYPES, default='normal', verbose_name='نوع پست')

    related_ring = models.ForeignKey(Ring, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    related_workgroup = models.ForeignKey(Workgroup, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')

    is_trending = models.BooleanField(default=False, verbose_name='ترند شده')
    like_count = models.PositiveIntegerField(default=0)
    comment_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'پست'
        verbose_name_plural = 'پست‌ها'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.full_name} - {self.post_type} - {self.created_at.date()}'


class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='post_likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')
        verbose_name = 'لایک پست'

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            post = self.post
            if post.post_type == 'circle_program' and post.related_ring:
                liker_ring = self.user.ring
                if liker_ring != post.related_ring:
                    ring = post.related_ring
                    ring.external_likes += 1
                    ring.save(update_fields=['external_likes'])
                    ring.recalculate_score()


class PostComment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField(verbose_name='متن کامنت')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'کامنت'


class PostRecommendation(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='recommendations')
    recommended_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recommendations_made')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'recommended_by')


class GrowthLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='growth_logs')
    date = models.DateField(verbose_name='تاریخ')
    sport_hours = models.FloatField(default=0, verbose_name='ساعت ورزش')
    study_pages = models.PositiveIntegerField(default=0, verbose_name='صفحه مطالعه')
    group_responsibility = models.TextField(blank=True, verbose_name='مسئولیت گروهی')
    personal_skill = models.TextField(blank=True, verbose_name='مهارت شخصی')
    leisure = models.TextField(blank=True, verbose_name='اوقات فراغت')
    extra_data = models.JSONField(default=dict, blank=True, verbose_name='اطلاعات اضافی')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'date')
        ordering = ['-date']
        verbose_name = 'گزارش رشد فردی'
        verbose_name_plural = 'گزارش‌های رشد فردی'


class UserInteraction(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='interactions')
    session_id = models.CharField(max_length=100, blank=True, verbose_name='شناسه نشست')
    page = models.CharField(max_length=50, verbose_name='صفحه')
    section = models.CharField(max_length=100, blank=True, verbose_name='بخش')
    element_type = models.CharField(max_length=50, blank=True, verbose_name='نوع المان')
    element_id = models.CharField(max_length=100, blank=True, verbose_name='شناسه المان')
    action = models.CharField(max_length=30, default='click', verbose_name='عملیات')
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'تعامل کاربر'
        verbose_name_plural = 'تعاملات کاربران'
        ordering = ['-created_at']


class Reel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reels')
    caption = models.TextField(blank=True)
    video = models.FileField(upload_to='reels/')
    thumbnail = models.ImageField(upload_to='reels/thumbnails/', null=True, blank=True)
    duration = models.FloatField(default=0)
    view_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'ریل'


class AIUsageLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=50, default='chat')
    tokens_used = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'لاگ هوش مصنوعی'
