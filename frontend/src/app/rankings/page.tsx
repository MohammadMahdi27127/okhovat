'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, FileText, PlusCircle, TrendingUp, User, Trophy, Loader2 } from 'lucide-react'
import { getRings } from '@/lib/api'

export default function RankingsPage() {
  const [rings, setRings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getRings()
      .then(data => setRings(data.results || data || []))
      .catch(err => setError(err.message || 'خطا در دریافت'))
      .finally(() => setLoading(false))
  }, [])

  const sorted = [...rings].sort(
    (a, b) => (a.rank || 99) - (b.rank || 99) || (b.score || 0) - (a.score || 0)
  )

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
          <NavItem href="/rankings" icon={<Trophy size={20} />} label="رتبه‌بندی حلقه‌ها" active />
          <NavItem href="/profile" icon={<User size={20} />} label="پروفایل من" />
        </nav>
        <div className="p-4 border-t border-slate-100 text-xs text-slate-500"><p>گروه اخوت</p></div>
      </aside>

      <main className="flex-1 mr-64 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="text-amber-500" size={28} />
              رتبه‌بندی حلقه‌ها
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              امتیاز = (امتیاز مربی × ۲) + (درصد حضور × ۲) + لایک‌های خارج از حلقه
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="animate-spin text-okhovat-600" size={28} /></div>
          ) : error ? (
            <div className="text-center py-16 text-slate-500 text-sm">{error}</div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">هنوز حلقه‌ای ثبت نشده</div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">جدول کامل</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {sorted.map((ring, index) => (
                  <motion.div
                    key={ring.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-5 py-4 flex items-center gap-4"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-slate-200 text-slate-600' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {ring.rank || index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-slate-800">{ring.name}</span>
                      <p className="text-xs text-slate-500">{ring.members_count || 0} عضو</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
                      <span>حضور {ring.attendance_avg || 0}٪</span>
                      <span>مربی {ring.coach_score || 0}</span>
                      <span>{ring.external_likes || 0} لایک</span>
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-okhovat-700">{ring.score || 0}</p>
                      <p className="text-[10px] text-slate-400">امتیاز</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 p-4 bg-white rounded-2xl border border-slate-100 text-sm text-slate-600 space-y-1">
            <p className="font-medium text-slate-800 mb-2">نحوه محاسبه امتیاز:</p>
            <p>• امتیاز مربی × <strong>۲</strong></p>
            <p>• درصد حضور اعضای حلقه × <strong>۲</strong></p>
            <p>• هر لایک از افراد خارج از حلقه روی برنامه حلقه = +۱ امتیاز</p>
          </div>
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
