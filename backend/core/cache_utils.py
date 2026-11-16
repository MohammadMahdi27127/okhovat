"""
ابزارهای کمکی برای مدیریت کش
"""
from django.core.cache import cache
from functools import wraps
import hashlib
import json


def make_cache_key(prefix: str, *args, **kwargs) -> str:
    """ساخت کلید یکتا برای کش"""
    raw = f"{prefix}:{args}:{sorted(kwargs.items())}"
    return f"{prefix}:{hashlib.md5(raw.encode()).hexdigest()[:12]}"


def cache_get(key: str, default=None):
    return cache.get(key, default)


def cache_set(key: str, value, timeout: int = 300):
    """timeout به ثانیه — پیش‌فرض ۵ دقیقه"""
    cache.set(key, value, timeout)


def cache_delete(key: str):
    cache.delete(key)


def cache_delete_pattern(prefix: str):
    """حذف همه کلیدهای مرتبط با یک prefix (فقط با Redis کامل کار می‌کند)"""
    try:
        cache.delete_pattern(f"{prefix}*")
    except AttributeError:
        # LocMemCache از delete_pattern پشتیبانی نمی‌کند
        pass


# کلیدهای استاندارد
CACHE_RINGS = 'rings:list'
CACHE_WORKGROUPS = 'workgroups:list'
CACHE_POSTS_PREFIX = 'posts'
CACHE_ADMIN_STATS = 'admin:stats'


def invalidate_posts_cache():
    """بعد از ایجاد/حذف/ویرایش پست"""
    cache_delete_pattern(CACHE_POSTS_PREFIX)


def invalidate_rings_cache():
    cache_delete(CACHE_RINGS)


def invalidate_admin_stats():
    cache_delete(CACHE_ADMIN_STATS)
