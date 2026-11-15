'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Home, FileText, PlusCircle, TrendingUp, User,
  Dumbbell, BookOpen, Users, Lightbulb, Coffee,
  Calendar, CheckCircle2
} from 'lucide-react'

export default function GrowthPage() {
  const [sport, setSport] = useState(0)
  const [study, setStudy] = useState(0)
  const [responsibility, setResponsibility] = useState('')
  const [skill, setSkill] = useState('')
  const [leisure, setLeisure] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const today = new Date().toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

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
          <NavItem href="/growth" icon={<TrendingUp size={20} />} label="رشد فردی" active />
          <NavItem href="/profile" icon={<User size={20} />} label="پروفایل من" />
        </nav>

        <div className="p-4 border-t border-slate-100 text-xs text-slate-500">
          <p>گروه اخوت</p>
          <p className="mt-1">۶۰ همراه، یک مسیر مشترک</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-64">
        <div className="max-w-2xl mx-auto py-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800">رشد فردی</h1>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                <Calendar size={14} />
                {today}
              </p>
            </div>

            {/* Form Card */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-gradient-to-l from-okhovat-50 to-white">
                <h2 className="font-semibold text-okhovat-800">امروزت چطور گذشت؟</h2>
                <p className="text-sm text-slate-500 mt-0.5">ثبت ورزش، مطالعه، مهارت و فعالیت‌های روزانه</p>
              </div>

              <div className="p-5 space-y-5">
                {/* Sport & Study - side by side */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Dumbbell size={16} className="text-orange-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">ورزش</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={sport}
                        onChange={(e) => setSport(Number(e.target.value))}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500"
                      />
                      <span className="text-xs text-slate-500 whitespace-nowrap">ساعت</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <BookOpen size={16} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">مطالعه</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={study}
                        onChange={(e) => setStudy(Number(e.target.value))}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500"
                      />
                      <span className="text-xs text-slate-500 whitespace-nowrap">صفحه</span>
                    </div>
                  </div>
                </div>

                {/* Group Responsibility */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Users size={16} className="text-okhovat-600" />
                    مسئولیت گروهی
                  </label>
                  <textarea
                    value={responsibility}
                    onChange={(e) => setResponsibility(e.target.value)}
                    placeholder="امروز چه مسئولیتی در گروه انجام دادی؟"
                    rows={2}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500 resize-none"
                  />
                </div>

                {/* Personal Skill */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Lightbulb size={16} className="text-amber-500" />
                    مهارت شخصی
                  </label>
                  <textarea
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    placeholder="چه مهارتی تمرین یا یاد گرفتی؟"
                    rows={2}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500 resize-none"
                  />
                </div>

                {/* Leisure */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Coffee size={16} className="text-purple-500" />
                    اوقات فراغت
                  </label>
                  <textarea
                    value={leisure}
                    onChange={(e) => setLeisure(e.target.value)}
                    placeholder="اوقات فراغتت چطور گذشت؟"
                    rows={2}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500 resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-okhovat-600 hover:bg-okhovat-700 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {submitted ? (
                    <>
                      <CheckCircle2 size={18} />
                      ثبت شد!
                    </>
                  ) : (
                    'ثبت رشد امروز'
                  )}
                </button>

                <p className="text-xs text-center text-slate-400">
                  بعد از ثبت، خلاصه‌ای از گزارشت در صفحه پست‌ها نمایش داده می‌شود.
                </p>
              </div>
            </form>

            {/* Tip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-5 p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800"
            >
              💡 هر شب تا ساعت ۲۲ فرم را پر کن. در غیر این صورت یک یادآوری از طریق بله برات ارسال می‌شود.
            </motion.div>
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
