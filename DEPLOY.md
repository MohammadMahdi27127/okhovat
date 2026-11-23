# استقرار پروداکشن اخوت

## پیش‌نیاز
- Python 3.11+، Node 20+
- PostgreSQL (توصیه) یا SQLite فقط برای توسعه
- دامنه و HTTPS (مثلاً با Caddy/Nginx)

## Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export DJANGO_SECRET_KEY='...'
export DEBUG=False
export ALLOWED_HOSTS=api.example.com
export CORS_ALLOWED_ORIGINS=https://app.example.com
export DATABASE_URL=postgres://...
# بله (OTP بازیابی رمز)
export BALE_ENABLED=True
export BALE_BOT_TOKEN=...
python manage.py migrate
python manage.py collectstatic --noinput
gunicorn config.wsgi:application -b 0.0.0.0:8000
```

## Frontend
```bash
cd frontend
npm ci
export NEXT_PUBLIC_API_URL=https://api.example.com/api
npm run build
npm run start
```

## بله
1. ربات در بله بسازید و توکن بگیرید
2. `BALE_ENABLED=True` و `BALE_BOT_TOKEN`
3. برای هر کاربر فیلد `bale_id` را در ادمین پر کنید
4. OTP از مسیر `/auth/forgot-password/` ارسال می‌شود

## تست دستی سریع
- لاگین و انتظار تا انقضای access → درخواست بعدی باید با refresh خودکار موفق شود
- ارسال پیام مربی → اعلان در `/notifications`
- پیشنهاد پست → اعلان برای مربی
- جستجو در فید با `?q=`

## E2E
پیکربندی اولیه Playwright در `frontend/playwright.config.ts` و تست دود در `e2e/smoke.spec.ts`.
```bash
cd frontend && npx playwright install && npx playwright test
```
