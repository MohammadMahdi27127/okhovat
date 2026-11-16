'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Home, FileText, BarChart3, User, Search,
  ChevronDown, Users, BookOpen, Dumbbell,
  Activity, Calendar, Loader2
} from 'lucide-react'
import { searchUsers, getGrowthLogs } from '@/lib/api'

export default function CoachPanel() {
  const [tab, setTab] = useState<'individual' | 'collective'>('individual')
  const [search, setSearch] = useState('')
  const [members, setMembers] = useState<any[]>([])
  const [selectedMember, setSelectedMember] = useState<any | null>(null)
  const [growthLogs, setGrowthLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingGrowth, setLoadingGrowth] = useState(false)
  const [selectedField, setSelectedField] = useState<'sport' | 'study' | 'attendance'>('sport')

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true)
      searchUsers(search || undefined)
        .then(data => setMembers(data.results || data || []))
        .catch(() => setMembers([]))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  const selectMember = async (m: any) => {
    setSelectedMember(m)
    setLoadingGrowth(true)
    try {
      const data = await getGrowthLogs(m.id)
      setGrowthLogs(data.results || data || [])
    } catch {
      setGrowthLogs([])
    } finally {
      setLoadingGrowth(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-sm">م</div>
            <div>
              <h1 className="font-bold text-slate-800 text-sm">پنل نظارتی مربی</h1>
              <p className="text-[11px] text-slate-400">مشاهده و پیگیری اعضا</p>
            </div>
          </div>
          <Link href="/" className="text-xs text-okhovat-600 hover:underline">بازگشت به خانه</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5">
        <div className="flex bg-white rounded-xl border border-slate-200 p-1 mb-5">
          <button
            onClick={() => setTab('individual')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
              tab === 'individual' ? 'bg-okhovat-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >نظرات فردی</button>
          <button
            onClick={() => setTab('collective')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
              tab === 'collective' ? 'bg-okhovat-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >نظرات جمعی</button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'individual' ? (
            <motion.div key="individual" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="relative">
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="جستجوی نام یا کد گروهی..."
                  className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500"
                />
              </div>

              {!selectedMember ? (
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  {loading ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-okhovat-600" size={24} /></div>
                  ) : members.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">عضوی یافت نشد</div>
                  ) : (
                    members.map(m => (
                      <button
                        key={m.id}
                        onClick={() => selectMember(m)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition border-b border-slate-50 last:border-0 text-right"
                      >
                        <div className="w-9 h-9 rounded-full bg-okhovat-100 text-okhovat-700 flex items-center justify-center text-sm font-bold">
                          {(m.full_name || '?')[0]}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{m.full_name}</p>
                          <p className="text-xs text-slate-400">{m.group_code}</p>
                        </div>
                        <ChevronDown size={16} className="text-slate-300 -rotate-90" />
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <button onClick={() => { setSelectedMember(null); setGrowthLogs([]) }} className="text-sm text-okhovat-600 hover:underline">
                    ← بازگشت به لیست
                  </button>

                  <div className="bg-white rounded-2xl border border-slate-100 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-okhovat-600 text-white flex items-center justify-center text-lg font-bold">
                        {(selectedMember.full_name || '?')[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{selectedMember.full_name}</p>
                        <p className="text-xs text-slate-400">کد {selectedMember.group_code}</p>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Activity size={14} /> رشد فردی
                    </h3>

                    {loadingGrowth ? (
                      <div className="flex justify-center py-6"><Loader2 className="animate-spin text-okhovat-600" size={20} /></div>
                    ) : growthLogs.length === 0 ? (
                      <p className="text-sm text-slate-400 py-4">ثبتی وجود ندارد</p>
                    ) : (
                      <div className="space-y-2">
                        {growthLogs.slice(0, 7).map((g: any) => (
                          <div key={g.id} className="bg-slate-50 rounded-xl p-3 text-xs">
                            <p className="font-medium text-slate-600 mb-1">{g.date}</p>
                            <div className="grid grid-cols-2 gap-1 text-slate-500">
                              <span>ورزش: {g.sport_hours} ساعت</span>
                              <span>مطالعه: {g.study_pages} صفحه</span>
                              {g.group_responsibility && <span className="col-span-2">مسئولیت: {g.group_responsibility}</span>}
                              {g.personal_skill && <span className="col-span-2">مهارت: {g.personal_skill}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-white border border-slate-100 rounded-xl p-3 text-sm text-slate-600 hover:border-okhovat-300 transition flex items-center gap-2">
                      <Users size={16} className="text-okhovat-600" /> جلسات کارگروه
                    </button>
                    <button className="bg-white border border-slate-100 rounded-xl p-3 text-sm text-slate-600 hover:border-okhovat-300 transition flex items-center gap-2">
                      <Calendar size={16} className="text-okhovat-600" /> برنامه حلقه
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="collective" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'sport', label: 'ورزش', icon: <Dumbbell size={14} /> },
                  { id: 'study', label: 'مطالعه', icon: <BookOpen size={14} /> },
                  { id: 'attendance', label: 'حضور', icon: <Users size={14} /> },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedField(f.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                      selectedField === f.id ? 'bg-okhovat-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {f.icon} {f.label}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-1.5">
                  <BarChart3 size={14} /> رده‌بندی {
                    selectedField === 'sport' ? 'ورزش' : selectedField === 'study' ? 'مطالعه' : 'حضور'
                  }
                </h3>
                <p className="text-sm text-slate-400 text-center py-6">
                  داده‌های رتبه‌بندی جمعی به‌زودی از API محاسبه می‌شود
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                  <p className="text-xs text-emerald-600 mb-0.5">۱۰ نفر اول</p>
                  <p className="text-sm font-bold text-emerald-700">فعال‌ترین‌ها</p>
                </div>
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-center">
                  <p className="text-xs text-rose-600 mb-0.5">۱۰ نفر آخر</p>
                  <p className="text-sm font-bold text-rose-700">نیاز به توجه</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-full shadow-lg px-2 py-1.5 flex items-center gap-1">
          <BottomNavItem href="/" icon={<Home size={18} />} label="خانه" />
          <BottomNavItem href="/posts" icon={<FileText size={18} />} label="پست‌ها" />
          <BottomNavItem href="/coach" icon={<BarChart3 size={18} />} label="نظارت" active />
          <BottomNavItem href="/profile" icon={<User size={18} />} label="پروفایل" />
        </div>
      </nav>
    </div>
  )
}

function BottomNavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-full transition ${
      active ? 'text-okhovat-600' : 'text-slate-400 hover:text-slate-600'
    }`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}
