# اخوت (Okhovat)

سامانه جامع مدیریت و تعامل گروه اخوت

## وضعیت فعلی پروژه

### ✅ انجام‌شده

**بک‌اند (Django + PostgreSQL)**
- مدل‌های کامل دیتابیس (User با نقش‌ها، Post، GrowthLog، UserInteraction، Reel و ...)
- سیستم احراز هویت با JWT و کد گروهی
- APIهای اولیه (لاگین، پست‌ها، رشد فردی، آنالیتیکس)
- ادمین پنل
- Docker Compose برای PostgreSQL

**فرانت‌اند (Next.js + Tailwind + Framer Motion)**
- ساختار پروژه Next.js
- Preloader الهام‌گرفته از NeoLeaf با نوشته «اخوت»
- اسکلت داشبورد با سایدبار و کارت خوش‌آمدگویی
- رنگ‌بندی و فونت هماهنگ با هویت اخوت

### 🚧 در حال انجام
- تکمیل صفحات (پست‌ها، رشد فردی، پروفایل)
- اتصال فرانت به بک‌اند
- انیمیشن‌های بیشتر
- پنل مربی و ادمین

## راه‌اندازی

### بک‌اند
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# PostgreSQL را با docker-compose up -d اجرا کنید
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### فرانت‌اند
```bash
cd frontend
npm install
npm run dev
```

سایت روی http://localhost:3000 در دسترس خواهد بود.

## تکنولوژی‌ها
- Backend: Django 5 + DRF + SimpleJWT + PostgreSQL
- Frontend: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion
