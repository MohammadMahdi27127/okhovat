'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, FileText, PlusCircle, TrendingUp, User, Trophy, Film } from 'lucide-react'

export default function ReelsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
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
        <nav className="flex-1 p-3 space-y-1">
          <NavItem href="/" icon={<Home size={20} />} label="خانهٔ اخوت" />
          <NavItem href="/posts" icon={<FileText size={20} />} label="پست‌ها" />
          <NavItem href="/new-post" icon={<PlusCircle size={20} />} label="پست جدید" />
          <NavItem href="/growth" icon={<TrendingUp size={20} />} label="رشد فردی" />
          <NavItem href="/reels" icon={<Film size={20} />} label="ریلز" active />
          <NavItem href="/rankings" icon={<Trophy size={20} />} label="رتبه‌بندی حلقه‌ها" />
          <NavItem href="/profile" icon={<User size={20} />} label="پروفایل من" />
        </nav>
        <div className="p-4 border-t border-slate-100 text-xs text-slate-500">
          <p>گروه اخوت</p>
          <p className="mt-1">۶۰ همراه، یک مسیر مشترک</p>
        </div>
      </aside>

      <main className="flex-1 mr-64 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-okhovat-500 to-okhovat-700 flex items-center justify-center mb-6 shadow-lg">
            <Film size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">ریلز اخوت</h1>
          <p className="text-slate-500 leading-relaxed">
            به زودی راه‌اندازی خواهد شد.
          </p>
          <p className="text-sm text-slate-400 mt-3">
            فضایی شبیه ریلز اینستاگرام برای اشتراک لحظه‌های گروه
          </p>
        </motion.div>
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
