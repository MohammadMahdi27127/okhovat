'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Home, FileText, PlusCircle, TrendingUp, User,
  Camera, Settings, Award, Users, Activity,
  MessageSquare, CheckSquare, ChevronLeft
} from 'lucide-react'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-slate-200 flex flex-col fixed right-0 top-0 bottom-0 z-40">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-okhovat-600 flex items-center justify-center text-white font-bold text-lg">
              ا
            </div>
            <div>
              <h1 className="font-bold text-okhovat-800 text-lg">اخوت</h1>
              <p className="text-xs text-slate-500">کنار هم، رو به رشد</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavItem href="/" icon={<Home size={20} />} label="خانهٔ اخوت" />
          <NavItem href="/posts" icon={<FileText size={20} />} label="پست‌ها" />
          <NavItem href="/new-post" icon={<PlusCircle size={20} />} label="پست جدید" />
          <NavItem href="/growth" icon={<TrendingUp size={20} />} label="رشد فردی" />
          <NavItem href="/profile" icon={<User size={20} />} label="پروفایل من" active />
        </nav>

        <div className="p-4 border-t border-slate-100 text-xs text-slate-500">
          <p>گروه اخوت</p>
          <p className="mt-1">۶۰ همراه، یک مسیر مشترک</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-64">
        <div className="max-w-3xl mx-auto py-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Profile Header */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5">
              <div className="h-28 bg-gradient-to-l from-okhovat-600 to-okhovat-700"></div>
              <div className="px-6 pb-5 -mt-12">
                <div className="flex items-end justify-between">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-okhovat-500 border-4 border-white flex items-center justify-center text-white text-3xl font-bold shadow-md">
                      عم
                    </div>
                    <button className="absolute bottom-0 left-0 w-8 h-8 bg-white rounded-full border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50">
                      <Camera size={14} className="text-slate-600" />
                    </button>
                  </div>
                  <button className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-okhovat-700 border border-slate-200 px-3 py-1.5 rounded-lg">
                    <Settings size={16} />
                    تنظیمات
                  </button>
                </div>

                <div className="mt-3">
                  <h1 className="text-xl font-bold text-slate-800">علی محمدی</h1>
                  <p className="text-sm text-slate-500">کد گروهی: ۱۰۲۴ · حلقه سلمان</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mt-5">
                  <StatBox label="حضور" value="۸۶٪" />
                  <StatBox label="دنبال‌کننده" value="۴۸" />
                  <StatBox label="دنبال‌شونده" value="۳۲" />
                  <StatBox label="پست" value="۱۲" />
                </div>

                {/* Level */}
                <div className="mt-4 p-3 bg-okhovat-50 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-okhovat-100 flex items-center justify-center">
                    <Award size={20} className="text-okhovat-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-okhovat-800">سطح ۳ · همراه پیگیر</p>
                    <div className="mt-1 h-2 bg-okhovat-100 rounded-full overflow-hidden">
                      <div className="h-full bg-okhovat-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5 overflow-x-auto">
              {['نمای کلی', 'وضعیت حلقه', 'وضعیت کارگروه', 'مصوبات', 'پیام مربی'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    activeTab === tab
                      ? 'bg-okhovat-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content based on tab */}
            <div className="space-y-4">
              {/* Circle Status */}
              <SectionCard title="وضعیت حلقه" icon={<Users size={18} />}>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-lg font-bold text-slate-800">۷۸٪</p>
                    <p className="text-xs text-slate-500">درصد حضور</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-lg font-bold text-slate-800">۸.۴</p>
                    <p className="text-xs text-slate-500">نمره حلقه</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-lg font-bold text-okhovat-600">۲</p>
                    <p className="text-xs text-slate-500">رتبه بین حلقه‌ها</p>
                  </div>
                </div>
                <button className="mt-3 text-sm text-okhovat-600 flex items-center gap-1 hover:underline">
                  رتبه‌بندی اعضای حلقه
                  <ChevronLeft size={14} />
                </button>
              </SectionCard>

              {/* Workgroup Status */}
              <SectionCard title="وضعیت کارگروه" icon={<Activity size={18} />}>
                <p className="text-sm text-slate-600 mb-2">کارگروه: <span className="font-medium">آموزش</span></p>
                <div className="space-y-2">
                  {['علی محمدی', 'حسین احمدی', 'مهدی کریمی'].map((name, i) => (
                    <div key={name} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-700">{name}</span>
                      <span className="text-xs text-slate-500">{90 - i * 12}٪ فعالیت</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Coach Message */}
              <SectionCard title="پیام مربی" icon={<MessageSquare size={18} />}>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-sm text-amber-900 leading-relaxed">
                    علی جان، پیشرفت خوبی در مطالعه داشتی این هفته. سعی کن منظم‌تر فرم رشد رو پر کنی. موفق باشی 🌟
                  </p>
                  <p className="text-xs text-amber-600 mt-2">مربی احمدی · ۲ روز پیش</p>
                </div>
              </SectionCard>

              {/* Resolutions */}
              <SectionCard title="مصوبات" icon={<CheckSquare size={18} />}>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                    <input type="checkbox" className="mt-0.5 rounded text-okhovat-600 focus:ring-okhovat-500" />
                    <div>
                      <p className="text-sm text-slate-800">هماهنگی جلسه هفتگی حلقه تا چهارشنبه</p>
                      <p className="text-xs text-slate-500 mt-0.5">مربوط به حلقه سلمان</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                    <input type="checkbox" defaultChecked className="mt-0.5 rounded text-okhovat-600 focus:ring-okhovat-500" />
                    <div>
                      <p className="text-sm text-slate-800 line-through opacity-60">ارسال گزارش ماهانه کارگروه</p>
                      <p className="text-xs text-slate-500 mt-0.5">مربوط به کارگروه آموزش</p>
                    </div>
                  </label>
                </div>
              </SectionCard>

              {/* Change Password */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="font-semibold text-slate-800 mb-3">تغییر رمز عبور</h3>
                <div className="space-y-3">
                  <input
                    type="password"
                    placeholder="رمز فعلی"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500"
                  />
                  <input
                    type="password"
                    placeholder="رمز جدید"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500"
                  />
                  <input
                    type="password"
                    placeholder="تکرار رمز جدید"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500"
                  />
                  <button className="bg-okhovat-600 hover:bg-okhovat-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition">
                    ذخیره رمز جدید
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
        active
          ? 'bg-okhovat-50 text-okhovat-700'
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-2">
      <p className="text-lg font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-okhovat-600">{icon}</span>
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  )
}
