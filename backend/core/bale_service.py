"""
سرویس ارسال پیام به پیام‌رسان بله

برای فعال‌سازی در پروداکشن:
1. از @botfather در بله یک ربات بسازید و توکن بگیرید
2. BALE_BOT_TOKEN را در .env قرار دهید
3. BALE_ENABLED=True

API بله مشابه تلگرام است:
https://tapi.bale.ai/bot<TOKEN>/sendMessage
"""
import os
import logging
import requests

logger = logging.getLogger(__name__)

BALE_ENABLED = os.getenv('BALE_ENABLED', 'False') == 'True'
BALE_BOT_TOKEN = os.getenv('BALE_BOT_TOKEN', '')
BALE_API_BASE = os.getenv('BALE_API_BASE', 'https://tapi.bale.ai')


def send_bale_message(chat_id: str, text: str) -> bool:
    """ارسال پیام متنی به یک کاربر بله."""
    if not BALE_ENABLED:
        logger.info(f'[Bale disabled] Would send to {chat_id}: {text[:80]}...')
        return False

    if not BALE_BOT_TOKEN or not chat_id:
        logger.warning('BALE_BOT_TOKEN or chat_id missing')
        return False

    url = f'{BALE_API_BASE}/bot{BALE_BOT_TOKEN}/sendMessage'
    try:
        resp = requests.post(url, json={
            'chat_id': chat_id,
            'text': text,
        }, timeout=10)
        if resp.status_code == 200:
            return True
        logger.error(f'Bale API error: {resp.status_code} {resp.text}')
        return False
    except Exception as e:
        logger.exception(f'Bale send failed: {e}')
        return False


def send_otp_code(bale_id: str, code: str) -> bool:
    text = (
        f'🔐 کد بازیابی رمز عبور اخوت\n\n'
        f'کد شما: {code}\n\n'
        f'این کد تا ۵ دقیقه معتبر است.\n'
        f'اگر شما درخواست نداده‌اید، این پیام را نادیده بگیرید.'
    )
    return send_bale_message(bale_id, text)


def send_growth_reminder(bale_id: str, full_name: str) -> bool:
    text = (
        f'سلام {full_name} 👋\n\n'
        f'فرم رشد فردی امروز هنوز ثبت نشده.\n'
        f'لطفاً تا ساعت ۲۲ در سامانه اخوت آن را پر کنید.'
    )
    return send_bale_message(bale_id, text)


def send_coach_reminder(bale_id: str) -> bool:
    text = (
        'سلام مربی عزیز 👋\n\n'
        'امروز هنوز وارد سامانه اخوت نشده‌اید.\n'
        'لطفاً وضعیت اعضا و پست‌ها را بررسی کنید.'
    )
    return send_bale_message(bale_id, text)


def notify_new_message(bale_id: str, preview: str) -> bool:
    text = f'📩 پیام جدید از مربی در اخوت\n\n{preview[:200]}'
    return send_bale_message(bale_id, text)
