'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Home, FileText, BarChart3, User, Search,
  ChevronDown, Users, BookOpen, Dumbbell,
  Activity, Calendar, Award, TrendingUp
} from 'lucide-react'

const members = [
  { id: 1, name: 'علی محمدی', ring: 'سلمان', code: '1024' },
  { id: 2, name: 'حسین احمدی', ring: 'مقداد', code: '1025' },
  { id: 3, name: 'مهدی کریمی', ring: 'ابوذر', code: '1026' },
  { id: 4, name: 'رضا موسوی', ring: 'سلمان', code: '1027' },
  { id: 5, name: 'سجاد کاظمی', ring: 'عمار', code: '1028' },
  { id: 6, name: 'امیر حسینی', ring: 'یاسر', code: '1029' },
]

const sampleGrowth = [
  { date: '۱۴۰۳/۰۸/۲۵', sport: 1.5, study: 20, responsibility: 'هماهنگی جلسه', skill: 'مطالعه زبان', leisure: 'پیاده‌روی' },
  { date: '۱۴۰۳/۰۸/۲۴', sport: 1.0, study: 15, responsibility: '—', skill: '—', leisure: 'خانواده' },
  { date: '۱۴۰۳/۰۸/۲۳', sport: 2.0, study: 25, responsibility: 'پیگیری مصوبه', skill: 'خلاصه کتاب', leisure: '—' },
]

const rankingData = {
  sport: [
    { name: 'علی محمدی', value: 8.5 },
    { name: 'حسین احمدی', value: 7.2 },
    { name: 'مهدی کریمی', value: 6.8 },
    { name: 'رضا موسوی', value: 5.5 },
    { name: 'سجاد کاظمی', value: 4.1 },
  ],
  study: [
    { name: 'مهدی کریمی', value: 120 },
    { name: 'علی محمدی', value: 95 },
    { name: 'رضا موسوی', value: 80 },
    { name: 'حسین احمدی', value: 70 },
    { name: 'امیر حسینی', value: 55 },
  ],
  attendance: [
    { name: 'حلقه سلمان', value: 92 },
    { name: 'حلقه مقداد', value: 85 },
    { name: 'حلقه ابوذر', value: 78 },
    { name: 'حلقه عمار', value: 74 },
    { name: 'حلقه یاسر', value: 70 },
  ],
}

export default function CoachPanel() {
  const [tab, setTab] = useState<'individual' | 'collective'>('individual')
  const [search, setSearch] = useState('')
  const [selectedMember, setSelectedMember] = useState<typeof members[0] | null>(null)
  const [selectedField, setSelectedField] = useState<'sport' | 'study' | 'attendance'>('sport')
  const [viewMode, setViewMode] = useState<'members' | 'rings' | 'workgroups'>('members')

  const filteredMembers = members.filter(m =>
    m.name.includes(search) || m.code.includes(search)
  )

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
              م
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-sm">پنل نظارتی مربی</h1>
              <p className="text-[11px] text-slate-400">مربی احمدی</p>
            </div>
          </div>
          <Link href="/" className="text-xs text-okhovat-600 hover:underline">
            بازگشت به خانه
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5">
        {/* Tabs */}
        <div className="flex bg-white rounded-xl border border-slate-200 p-1 mb-5">
          <button
            onClick={() => setTab('individual')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
              tab === 'individual'
                ? 'bg-okhovat-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            نظرات فردی
          </button>
          <button
            onClick={() => setTab('collective')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
              tab === 'collective'
                ? 'bg-okhovat-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            نظرات جمعی
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'individual' ? (
            <motion.div
              key="individual"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="جستجوی نام یا کد گروهی..."
                  className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500"
                />
              </div>

              {/* Member list or detail */}
              {!selectedMember ? (
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  {filteredMembers.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMember(m)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition border-b border-slate-50 last:border-0 text-right"
                    >
                      <div className="w-9 h-9 rounded-full bg-okhovat-100 text-okhovat-700 flex items-center justify-center text-sm font-bold">
                        {m.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{m.name}</p>
                        <p className="text-xs text-slate-400">حلقه {m.ring} · {m.code}</p>
                      </div>
                      <ChevronDown size={16} className="text-slate-300 -rotate-90" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="text-sm text-okhovat-600 hover:underline"
                  >
                    ← بازگشت به لیست
                  </button>

                  {/* Member card */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-okhovat-600 text-white flex items-center justify-center text-lg font-bold">
                        {selectedMember.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{selectedMember.name}</p>
                        <p className="text-xs text-slate-400">حلقه {selectedMember.ring} · کد {selectedMember.code}</p>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Activity size={14} />
                      رشد فردی هفته اخیر
                    </h3>
                    <div className="space-y-2">
                      {sampleGrowth.map((g, i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-3 text-xs">
                          <p className="font-medium text-slate-600 mb-1">{g.date}</p>
                          <div className="grid grid-cols-2 gap-1 text-slate-500">
                            <span>ورزش: {g.sport} ساعت</span>
                            <span>مطالعه: {g.study} صفحه</span>
                            <span>مسئولیت: {g.responsibility}</span>
                            <span>مهارت: {g.skill}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick links */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-white border border-slate-100 rounded-xl p-3 text-sm text-slate-600 hover:border-okhovat-300 transition flex items-center gap-2">
                      <Users size={16} className="text-okhovat-600" />
                      جلسات کارگروه
                    </button>
                    <button className="bg-white border border-slate-100 rounded-xl p-3 text-sm text-slate-600 hover:border-okhovat-300 transition flex items-center gap-2">
                      <Calendar size={16} className="text-okhovat-600" />
                      برنامه حلقه
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="collective"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              {/* Field selector */}
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
                      selectedField === f.id
                        ? 'bg-okhovat-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-okhovat-300'
                    }`}
                  >
                    {f.icon}
                    {f.label}
                  </button>
                ))}
              </div>

              {/* View mode */}
              <div className="flex gap-2">
                {[
                  { id: 'members', label: 'افراد' },
                  { id: 'rings', label: 'حلقه‌ها' },
                  { id: 'workgroups', label: 'کارگروه‌ها' },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setViewMode(m.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      viewMode === m.id
                        ? 'bg-slate-800 text-white'
                        : 'bg-white text-slate-500 border border-slate-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Chart-like ranking */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-1.5">
                  <BarChart3 size={14} />
                  رده‌بندی {
                    selectedField === 'sport' ? 'ورزش' :
                    selectedField === 'study' ? 'مطالعه' : 'حضور'
                  }
                </h3>

                <div className="space-y-3">
                  {(rankingData[selectedField] || []).map((item, i) => {
                    const max = rankingData[selectedField][0]?.value || 1
                    const pct = (item.value / max) * 100
                    return (
                      <div key={item.name} className="flex items-center gap-3">
                        <span className={`w-5 text-xs font-bold ${
                          i === 0 ? 'text-amber-500' : 'text-slate-400'
                        }`}>
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-sm text-slate-700">{item.name}</span>
                            <span className="text-xs font-medium text-slate-500">{item.value}</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.5, delay: i * 0.05 }}
                              className={`h-full rounded-full ${
                                i === 0 ? 'bg-amber-400' : 'bg-okhovat-500'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Top / Bottom note */}
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

      {/* Bottom Nav - Telegram style capsule */}
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
    <Link
      href={href}
      className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-full transition ${
        active ? 'text-okhovat-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}
