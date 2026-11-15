'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Preloader from '@/components/Preloader'
import { Home, FileText, PlusCircle, TrendingUp, User } from 'lucide-react'

export default function HomePage() {
  const [loading, setLoading] = useState(true)

  if (loading) {
    return <Preloader onComplete={() => setLoading(false)} />
  }

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
          <NavItem icon={<Home size={20} />} label="خانهٔ اخوت" active />
          <NavItem icon={<FileText size={20} />} label="پست‌ها" />
          <NavItem icon={<PlusCircle size={20} />} label="پست جدید" />
          <NavItem icon={<TrendingUp size={20} />} label="رشد فردی" />
          <NavItem icon={<User size={20} />} label="پروفایل من" />
        </nav>

        <div className="p-4 border-t border-slate-100 text-xs text-slate-500">
          <p>گروه اخوت</p>
          <p className="mt-1">۶۰ همراه، یک مسیر مشترک</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-64 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-l from-okhovat-700 to-okhovat-600 rounded-2xl p-6 text-white mb-6 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                🤖
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">سلام دوست عزیز</h2>
                <p className="text-okhovat-100 leading-relaxed">
                  به سامانهٔ ما خوش آمدی. اگر کمکی خواستی بهم بگو.
                </p>
                <button className="mt-4 bg-amber-400 hover:bg-amber-300 text-okhovat-900 px-4 py-2 rounded-lg text-sm font-medium transition">
                  گفت‌وگو با همراه اخوت
                </button>
              </div>
            </div>
          </motion.div>

          {/* Placeholder cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PlaceholderCard title="قرار این هفته" />
            <PlaceholderCard title="حلقه‌های پیشرو" />
            <PlaceholderCard title="محتوای کارگروه‌ها" />
            <PlaceholderCard title="گزارش روزانه" />
          </div>
        </div>
      </main>
    </div>
  )
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
        active
          ? 'bg-okhovat-50 text-okhovat-700'
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function PlaceholderCard({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
    >
      <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500">به زودی محتوا اضافه می‌شود...</p>
    </motion.div>
  )
}
