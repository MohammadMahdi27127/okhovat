'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Home, FileText, PlusCircle, TrendingUp, User, Trophy, Film,
  Users, Wallet, BookOpen, Heart, Wrench, Dumbbell, Package,
  Shield, Palette, Upload, Check, X, ChevronLeft
} from 'lucide-react'

const workgroups: Record<string, {
  name: string
  icon: React.ReactNode
  color: string
  description: string
  leaderFields: string[]
}> = {
  'paziresh': {
    name: 'پذیرش',
    icon: <Users size={22} />,
    color: 'bg-blue-500',
    description: 'مدیریت ورود و عضویت افراد جدید',
    leaderFields: ['لیست وانتدها', 'افراد پیشنهادی']
  },
  'mali': {
    name: 'مالی',
    icon: <Wallet size={22} />,
    color: 'bg-emerald-500',
    description: 'مدیریت هزینه‌ها و بدهکاران',
    leaderFields: ['بدهکاران گروه', 'لیست هزینه‌های ماه']
  },
  'amoozesh': {
    name: 'آموزش',
    icon: <BookOpen size={22} />,
    color: 'bg-indigo-500',
    description: 'برنامه‌های آموزشی و جلسات',
    leaderFields: ['جلسات آموزشی', 'محتوای آموزشی']
  },
  'olum-eslami': {
    name: 'علوم اسلامی',
    icon: <BookOpen size={22} />,
    color: 'bg-violet-500',
    description: 'فعالیت‌های کتابخوانی و معارف',
    leaderFields: ['لیست کتابخوان‌ها']
  },
  'khadamat': {
    name: 'خدمات',
    icon: <Heart size={22} />,
    color: 'bg-rose-500',
    description: 'خدمات عمومی گروه',
    leaderFields: ['فعالیت‌های خدماتی']
  },
  'tarbiyat-badani': {
    name: 'تربیت بدنی',
    icon: <Dumbbell size={22} />,
    color: 'bg-orange-500',
    description: 'ورزش و فعالیت‌های بدنی',
    leaderFields: ['ورزشکاران', 'لیست حضور و غیاب باشگاه']
  },
  'tadarokat': {
    name: 'تدارکات',
    icon: <Package size={22} />,
    color: 'bg-amber-500',
    description: 'جمع و پخش و پشتیبانی اجرایی',
    leaderFields: ['لیست جمع و پخش و شست‌وشو']
  },
  'sazmandehi': {
    name: 'سازماندهی',
    icon: <Shield size={22} />,
    color: 'bg-slate-600',
    description: 'نظم و انضباط گروه',
    leaderFields: ['لیست متخلفین']
  },
  'farhangi': {
    name: 'فرهنگی',
    icon: <Palette size={22} />,
    color: 'bg-pink-500',
    description: 'فعالیت‌های فرهنگی و هنری',
    leaderFields: ['برنامه‌های فرهنگی']
  },
}

const sampleMembers = ['علی محمدی', 'حسین احمدی', 'مهدی کریمی', 'رضا موسوی', 'سجاد کاظمی', 'امیر حسینی']

export default function WorkgroupPage() {
  const params = useParams()
  const slug = params.slug as string
  const wg = workgroups[slug]

  // شبیه‌سازی نقش کاربر (در نسخه واقعی از auth میاد)
  const [isLeader] = useState(true) // برای تست، مسئول فرض می‌شود
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [expenseName, setExpenseName] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenses, setExpenses] = useState<{name: string; amount: string}[]>([
    { name: 'اجاره سالن', amount: '۲۰۰٬۰۰۰' },
    { name: 'پذیرایی جلسه', amount: '۱۵۰٬۰۰۰' },
  ])

  if (!wg) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        کارگروه یافت نشد
      </div>
    )
  }

  const toggleMember = (name: string) => {
    setSelectedMembers(prev =>
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    )
  }

  const addExpense = () => {
    if (expenseName && expenseAmount) {
      setExpenses(prev => [...prev, { name: expenseName, amount: expenseAmount }])
      setExpenseName('')
      setExpenseAmount('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-slate-200 flex flex-col fixed right-0 top-0 bottom-0 z-40">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-okhovat-600 flex items-center justify-center text-white font-bold text-lg">ا</div>
            <div>
              <h1 className="font-bold text-okhovat-800 text-lg">اخوت</h1>
              <p className="text-xs text-slate-500">کنار هم، رو به رشد</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavItem href="/" icon={<Home size={20} />} label="خانهٔ اخوت" />
          <NavItem href="/posts" icon={<FileText size={20} />} label="پپست‌ها" />
          <NavItem href="/new-post" icon={<PlusCircle size={20} />} label="پست جدید" />
          <NavItem href="/growth" icon={<TrendingUp size={20} />} label="رشد فردی" />
          <NavItem href="/reels" icon={<Film size={20} />} label="ریلز" />
          <NavItem href="/rankings" icon={<Trophy size={20} />} label="رتبه‌بندی حلقه‌ها" />
          <NavItem href="/profile" icon={<User size={20} />} label="پروفایل من" />

          <div className="pt-3 mt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 px-3 mb-2">کارگروه‌ها</p>
            {Object.entries(workgroups).map(([key, g]) => (
              <NavItem
                key={key}
                href={`/workgroup/${key}`}
                icon={g.icon}
                label={g.name}
                active={slug === key}
              />
            ))}
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 mr-64 p-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl ${wg.color} flex items-center justify-center text-white shadow-md`}>
                {wg.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">کارگروه {wg.name}</h1>
                <p className="text-sm text-slate-500">{wg.description}</p>
              </div>
            </div>

            {/* Leader Panel */}
            {isLeader && (
              <div className="space-y-4 mb-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-slate-800">پنل مسئول</h2>
                    <span className="text-xs bg-okhovat-50 text-okhovat-700 px-2.5 py-1 rounded-full">شما مسئول این کارگروه هستید</span>
                  </div>

                  {/* Common: Member selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">انتخاب افراد</label>
                    <div className="flex flex-wrap gap-2">
                      {sampleMembers.map(name => (
                        <button
                          key={name}
                          onClick={() => toggleMember(name)}
                          className={`text-sm px-3 py-1.5 rounded-full border transition ${
                            selectedMembers.includes(name)
                              ? 'bg-okhovat-600 text-white border-okhovat-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-okhovat-300'
                          }`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Specific fields based on workgroup */}
                  {slug === 'mali' && (
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <p className="text-sm font-medium text-slate-700">ثبت هزینه ماه</p>
                      <div className="flex gap-2">
                        <input
                          value={expenseName}
                          onChange={e => setExpenseName(e.target.value)}
                          placeholder="نام برنامه"
                          className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500"
                        />
                        <input
                          value={expenseAmount}
                          onChange={e => setExpenseAmount(e.target.value)}
                          placeholder="مبلغ (تومان)"
                          className="w-32 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500"
                        />
                        <button
                          onClick={addExpense}
                          className="bg-okhovat-600 hover:bg-okhovat-700 text-white px-4 py-2 rounded-xl text-sm transition"
                        >
                          افزودن
                        </button>
                      </div>
                    </div>
                  )}

                  {slug === 'tadarokat' && (
                    <div className="pt-3 border-t border-slate-100">
                      <label className="block text-sm font-medium text-slate-700 mb-2">نوع کار</label>
                      <div className="flex gap-2">
                        {['جمع', 'پخش', 'شست‌وشو'].map(t => (
                          <button key={t} className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:border-okhovat-400 hover:bg-okhovat-50 transition">
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <button className="flex items-center gap-2 text-sm text-okhovat-600 hover:text-okhovat-700">
                      <Upload size={16} />
                      بارگذاری عکس یا فایل
                    </button>
                  </div>

                  <button className="mt-4 w-full bg-okhovat-600 hover:bg-okhovat-700 text-white font-medium py-2.5 rounded-xl transition">
                    ذخیره و انتشار در داشبورد
                  </button>
                </div>
              </div>
            )}

            {/* Public View (for everyone) */}
            <div className="space-y-4">
              <h2 className="font-semibold text-slate-800 text-sm">محتوای کارگروه</h2>

              {slug === 'mali' && (
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">هزینه‌های ماه جاری</h3>
                  <div className="space-y-2">
                    {expenses.map((e, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <span className="text-sm text-slate-700">{e.name}</span>
                        <span className="text-sm font-medium text-slate-900">{e.amount} تومان</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {slug === 'paziresh' && (
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">افراد پیشنهادی (وانتد)</h3>
                  <div className="flex flex-wrap gap-2">
                    {['سارا احمدی', 'محمد کریمی', 'زهرا موسوی'].map(name => (
                      <div key={name} className="flex items-center gap-2 bg-slate-50 rounded-full px-3 py-1.5">
                        <div className="w-6 h-6 rounded-full bg-okhovat-200 text-okhovat-700 text-xs flex items-center justify-center font-bold">
                          {name[0]}
                        </div>
                        <span className="text-sm text-slate-700">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {slug === 'tarbiyat-badani' && (
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">ورزشکاران فعال</h3>
                  <div className="space-y-2">
                    {['علی محمدی — ۳ جلسه', 'حسین احمدی — ۲ جلسه', 'مهدی کریمی — ۴ جلسه'].map(item => (
                      <div key={item} className="text-sm text-slate-700 py-1.5">{item}</div>
                    ))}
                  </div>
                </div>
              )}

              {slug === 'olum-eslami' && (
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">کتابخوان‌های این هفته</h3>
                  <div className="flex flex-wrap gap-2">
                    {sampleMembers.slice(0, 4).map(name => (
                      <span key={name} className="text-sm bg-violet-50 text-violet-700 px-3 py-1 rounded-full">{name}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Default empty state for others */}
              {!['mali', 'paziresh', 'tarbiyat-badani', 'olum-eslami'].includes(slug) && (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
                  <p className="text-slate-400 text-sm">هنوز محتوایی ثبت نشده است</p>
                </div>
              )}
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
        active ? 'bg-okhovat-50 text-okhovat-700' : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}
