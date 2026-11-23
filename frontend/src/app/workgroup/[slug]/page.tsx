'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import {
  Users, Wallet, BookOpen, Heart, Dumbbell, Package,
  Shield, Palette, Upload, ChevronLeft
} from 'lucide-react'

const workgroups: Record<
  string,
  {
    name: string
    icon: React.ReactNode
    color: string
    description: string
    leaderFields: string[]
  }
> = {
  paziresh: {
    name: 'پذیرش',
    icon: <Users size={22} />,
    color: 'bg-blue-500',
    description: 'مدیریت ورود و عضویت افراد جدید',
    leaderFields: ['لیست وانتدها', 'افراد پیشنهادی'],
  },
  mali: {
    name: 'مالی',
    icon: <Wallet size={22} />,
    color: 'bg-emerald-500',
    description: 'مدیریت هزینه‌ها و بدهکاران',
    leaderFields: ['بدهکاران گروه', 'لیست هزینه‌های ماه'],
  },
  amoozesh: {
    name: 'آموزش',
    icon: <BookOpen size={22} />,
    color: 'bg-indigo-500',
    description: 'برنامه‌های آموزشی و جلسات',
    leaderFields: ['جلسات آموزشی', 'محتوای آموزشی'],
  },
  'olum-eslami': {
    name: 'علوم اسلامی',
    icon: <BookOpen size={22} />,
    color: 'bg-violet-500',
    description: 'فعالیت‌های کتابخوانی و معارف',
    leaderFields: ['لیست کتابخوان‌ها'],
  },
  khadamat: {
    name: 'خدمات',
    icon: <Heart size={22} />,
    color: 'bg-rose-500',
    description: 'خدمات عمومی گروه',
    leaderFields: ['فعالیت‌های خدماتی'],
  },
  'tarbiyat-badani': {
    name: 'تربیت بدنی',
    icon: <Dumbbell size={22} />,
    color: 'bg-orange-500',
    description: 'ورزش و فعالیت‌های بدنی',
    leaderFields: ['ورزشکاران', 'لیست حضور و غیاب باشگاه'],
  },
  tadarokat: {
    name: 'تدارکات',
    icon: <Package size={22} />,
    color: 'bg-amber-500',
    description: 'جمع و پخش و پشتیبانی اجرایی',
    leaderFields: ['لیست جمع و پخش و شست‌وشو'],
  },
  sazmandehi: {
    name: 'سازماندهی',
    icon: <Shield size={22} />,
    color: 'bg-slate-600',
    description: 'نظم و انضباط گروه',
    leaderFields: ['لیست متخلفین'],
  },
  farhangi: {
    name: 'فرهنگی',
    icon: <Palette size={22} />,
    color: 'bg-pink-500',
    description: 'فعالیت‌های فرهنگی و هنری',
    leaderFields: ['برنامه‌های فرهنگی'],
  },
  // aliases from home page links
  education: {
    name: 'آموزش',
    icon: <BookOpen size={22} />,
    color: 'bg-indigo-500',
    description: 'برنامه‌های آموزشی و جلسات',
    leaderFields: ['جلسات آموزشی', 'محتوای آموزشی'],
  },
  salman: {
    name: 'حلقه سلمان',
    icon: <Users size={22} />,
    color: 'bg-okhovat-500',
    description: 'صفحه مرتبط با حلقه (نمایش محتوا)',
    leaderFields: [],
  },
}

const sampleMembers = ['علی محمدی', 'حسین احمدی', 'مهدی کریمی', 'رضا موسوی', 'سجاد کاظمی', 'امیر حسینی']

export default function WorkgroupPage() {
  const params = useParams()
  const slug = params.slug as string
  const wg = workgroups[slug]

  const [isLeader] = useState(true)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [expenseName, setExpenseName] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenses, setExpenses] = useState<{ name: string; amount: string }[]>([
    { name: 'اجاره سالن', amount: '۲۰۰٬۰۰۰' },
    { name: 'پذیرایی جلسه', amount: '۱۵۰٬۰۰۰' },
  ])
  const [saved, setSaved] = useState(false)

  if (!wg) {
    return (
      <AppShell>
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <p className="text-okhovat-500 mb-4">کارگروه یافت نشد</p>
          <Link href="/" className="text-sm text-okhovat-600 hover:underline">
            بازگشت به خانه
          </Link>
        </div>
      </AppShell>
    )
  }

  const toggleMember = (name: string) => {
    setSelectedMembers((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    )
  }

  const addExpense = () => {
    if (expenseName && expenseAmount) {
      setExpenses((prev) => [...prev, { name: expenseName, amount: expenseAmount }])
      setExpenseName('')
      setExpenseAmount('')
    }
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back + Header */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-okhovat-500 hover:text-okhovat-600 mb-4"
          >
            <ChevronLeft size={16} className="rotate-180" />
            خانه
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-14 h-14 rounded-2xl ${wg.color} flex items-center justify-center text-white shadow-md shrink-0`}
            >
              {wg.icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-okhovat-800 dark:text-okhovat-100">
                کارگروه {wg.name}
              </h1>
              <p className="text-sm text-okhovat-500 dark:text-okhovat-400">{wg.description}</p>
            </div>
          </div>

          {/* Other workgroups quick links */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(workgroups)
              .filter(([key]) => !['education', 'salman'].includes(key))
              .map(([key, g]) => (
                <Link
                  key={key}
                  href={`/workgroup/${key}`}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${
                    slug === key
                      ? 'bg-okhovat-500 text-white border-okhovat-500'
                      : 'bg-white dark:bg-okhovat-900 text-okhovat-600 dark:text-okhovat-300 border-okhovat-200 dark:border-okhovat-700 hover:border-okhovat-400'
                  }`}
                >
                  {g.name}
                </Link>
              ))}
          </div>

          {/* Leader Panel */}
          {isLeader && wg.leaderFields.length > 0 && (
            <div className="card p-5 mb-5">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="font-semibold text-okhovat-800 dark:text-okhovat-100">پنل مسئول</h2>
                <span className="text-xs bg-okhovat-50 dark:bg-okhovat-900 text-okhovat-700 dark:text-okhovat-300 px-2.5 py-1 rounded-full">
                  شما مسئول این کارگروه هستید
                </span>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-okhovat-700 dark:text-okhovat-200 mb-2">
                  انتخاب افراد
                </label>
                <div className="flex flex-wrap gap-2">
                  {sampleMembers.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleMember(name)}
                      className={`text-sm px-3 py-1.5 rounded-full border transition ${
                        selectedMembers.includes(name)
                          ? 'bg-okhovat-500 text-white border-okhovat-500'
                          : 'bg-white dark:bg-okhovat-900 text-okhovat-600 dark:text-okhovat-300 border-okhovat-200 dark:border-okhovat-700'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {slug === 'mali' && (
                <div className="space-y-3 pt-3 border-t border-okhovat-100 dark:border-okhovat-800">
                  <p className="text-sm font-medium text-okhovat-700 dark:text-okhovat-200">ثبت هزینه ماه</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={expenseName}
                      onChange={(e) => setExpenseName(e.target.value)}
                      placeholder="نام برنامه"
                      className="input-field flex-1"
                    />
                    <input
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      placeholder="مبلغ (تومان)"
                      className="input-field sm:w-32"
                    />
                    <button
                      type="button"
                      onClick={addExpense}
                      className="btn-primary px-4 py-2.5 text-sm shrink-0"
                    >
                      افزودن
                    </button>
                  </div>
                </div>
              )}

              {slug === 'tadarokat' && (
                <div className="pt-3 border-t border-okhovat-100 dark:border-okhovat-800">
                  <label className="block text-sm font-medium text-okhovat-700 dark:text-okhovat-200 mb-2">
                    نوع کار
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['جمع', 'پخش', 'شست‌وشو'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        className="px-4 py-2 text-sm border border-okhovat-200 dark:border-okhovat-700 rounded-xl hover:border-okhovat-400 hover:bg-okhovat-50 dark:hover:bg-okhovat-900 transition text-okhovat-700 dark:text-okhovat-200"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-okhovat-100 dark:border-okhovat-800">
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm text-okhovat-600 dark:text-okhovat-400 hover:text-okhovat-500"
                >
                  <Upload size={16} />
                  بارگذاری عکس یا فایل
                </button>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="mt-4 w-full btn-primary py-2.5"
              >
                {saved ? 'ذخیره شد ✓' : 'ذخیره و انتشار در داشبورد'}
              </button>
            </div>
          )}

          {/* Public content */}
          <div className="space-y-4">
            <h2 className="font-semibold text-okhovat-800 dark:text-okhovat-100 text-sm">محتوای کارگروه</h2>

            {(slug === 'mali' || slug === 'mali') && (
              <div className="card p-5">
                <h3 className="text-sm font-medium text-okhovat-700 dark:text-okhovat-200 mb-3">
                  هزینه‌های ماه جاری
                </h3>
                <div className="space-y-2">
                  {expenses.map((e, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-okhovat-50 dark:border-okhovat-800 last:border-0"
                    >
                      <span className="text-sm text-okhovat-700 dark:text-okhovat-200">{e.name}</span>
                      <span className="text-sm font-medium text-okhovat-800 dark:text-okhovat-100">
                        {e.amount} تومان
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {slug === 'paziresh' && (
              <div className="card p-5">
                <h3 className="text-sm font-medium text-okhovat-700 dark:text-okhovat-200 mb-3">
                  افراد پیشنهادی (وانتد)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['سارا احمدی', 'محمد کریمی', 'زهرا موسوی'].map((name) => (
                    <div
                      key={name}
                      className="flex items-center gap-2 bg-okhovat-50 dark:bg-okhovat-900 rounded-full px-3 py-1.5"
                    >
                      <div className="w-6 h-6 rounded-full bg-okhovat-200 dark:bg-okhovat-700 text-okhovat-700 dark:text-okhovat-200 text-xs flex items-center justify-center font-bold">
                        {name[0]}
                      </div>
                      <span className="text-sm text-okhovat-700 dark:text-okhovat-200">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {slug === 'tarbiyat-badani' && (
              <div className="card p-5">
                <h3 className="text-sm font-medium text-okhovat-700 dark:text-okhovat-200 mb-3">
                  ورزشکاران فعال
                </h3>
                <div className="space-y-2">
                  {['علی محمدی — ۳ جلسه', 'حسین احمدی — ۲ جلسه', 'مهدی کریمی — ۴ جلسه'].map((item) => (
                    <div key={item} className="text-sm text-okhovat-700 dark:text-okhovat-200 py-1.5">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(slug === 'olum-eslami' || slug === 'amoozesh' || slug === 'education') && (
              <div className="card p-5">
                <h3 className="text-sm font-medium text-okhovat-700 dark:text-okhovat-200 mb-3">
                  {slug === 'olum-eslami' ? 'کتابخوان‌های این هفته' : 'جلسات و محتوای آموزشی'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sampleMembers.slice(0, 4).map((name) => (
                    <span
                      key={name}
                      className="text-sm bg-okhovat-50 dark:bg-okhovat-900 text-okhovat-700 dark:text-okhovat-200 px-3 py-1 rounded-full"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!['mali', 'paziresh', 'tarbiyat-badani', 'olum-eslami', 'amoozesh', 'education'].includes(
              slug
            ) && (
              <div className="card p-8 text-center">
                <p className="text-okhovat-400 text-sm">هنوز محتوایی ثبت نشده است</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}
