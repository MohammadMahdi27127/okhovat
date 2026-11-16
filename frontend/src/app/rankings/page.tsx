'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Home, FileText, PlusCircle, TrendingUp, User,
  Trophy, Medal, Users, Activity, Star, ChevronUp, ChevronDown
} from 'lucide-react'

const ringsData = [
  {
    id: 1,
    name: 'حلقه سلمان',
    rank: 1,
    score: 94.5,
    attendance: 92,
    coachScore: 9.2,
    externalLikes: 28,
    membersCount: 9,
    change: 'up',
    topMembers: ['محمد رضایی', 'علی محمدی', 'حسین احمدی']
  },
  {
    id: 2,
    name: 'حلقه مقداد',
    rank: 2,
    score: 88.0,
    attendance: 85,
    coachScore: 8.7,
    externalLikes: 19,
    membersCount: 8,
    change: 'same',
    topMembers: ['سجاد کاظمی', 'رضا موسوی']
  },
  {
    id: 3,
    name: 'حلقه ابوذر',
    rank: 3,
    score: 81.5,
    attendance: 78,
    coachScore: 8.1,
    externalLikes: 14,
    membersCount: 9,
    change: 'up',
    topMembers: ['امیر حسینی', 'مهدی کریمی']
  },
  {
    id: 4,
    name: 'حلقه عمار',
    rank: 4,
    score: 76.2,
    attendance: 74,
    coachScore: 7.5,
    externalLikes: 11,
    membersCount: 8,
    change: 'down',
    topMembers: ['حسین نوری']
  },
  {
    id: 5,
    name: 'حلقه یاسر',
    rank: 5,
    score: 71.0,
    attendance: 70,
    coachScore: 7.0,
    externalLikes: 8,
    membersCount: 9,
    change: 'down',
    topMembers: ['کاظم رضایی']
  },
  {
    id: 6,
    name: 'حلقه حبیب',
    rank: 6,
    score: 65.5,
    attendance: 68,
    coachScore: 6.5,
    externalLikes: 5,
    membersCount: 8,
    change: 'same',
    topMembers: ['جواد محمدی']
  },
  {
    id: 7,
    name: 'حلقه بلال',
    rank: 7,
    score: 58.0,
    attendance: 60,
    coachScore: 6.0,
    externalLikes: 3,
    membersCount: 9,
    change: 'down',
    topMembers: ['سعید احمدی']
  },
]

export default function RankingsPage() {
  const [selectedRing, setSelectedRing] = useState<number | null>(null)

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
          <NavItem href="/rankings" icon={<Trophy size={20} />} label="رتبه‌بندی حلقه‌ها" active />
          <NavItem href="/profile" icon={<User size={20} />} label="پروفایل من" />
        </nav>

        <div className="p-4 border-t border-slate-100 text-xs text-slate-500">
          <p>گروه اخوت</p>
          <p className="mt-1">۶۰ همراه، یک مسیر مشترک</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 mr-64 p-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Trophy className="text-amber-500" size={28} />
                رتبه‌بندی حلقه‌ها
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                امتیاز = (امتیاز مربی × ۲) + (درصد حضور × ۲) + لایک‌های خارج از حلقه
              </p>
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {/* Second */}
              <PodiumCard ring={ringsData[1]} place={2} delay={0.1} />
              {/* First */}
              <PodiumCard ring={ringsData[0]} place={1} delay={0} highlight />
              {/* Third */}
              <PodiumCard ring={ringsData[2]} place={3} delay={0.2} />
            </div>

            {/* Full Ranking List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800">جدول کامل</h2>
                <span className="text-xs text-slate-400">به‌روزرسانی هفتگی</span>
              </div>

              <div className="divide-y divide-slate-50">
                {ringsData.map((ring, index) => (
                  <motion.div
                    key={ring.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedRing(selectedRing === ring.id ? null : ring.id)}
                    className={`px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition ${
                      selectedRing === ring.id ? 'bg-okhovat-50' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      ring.rank === 1 ? 'bg-amber-100 text-amber-700' :
                      ring.rank === 2 ? 'bg-slate-200 text-slate-600' :
                      ring.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {ring.rank}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{ring.name}</span>
                        {ring.change === 'up' && <ChevronUp size={14} className="text-green-500" />}
                        {ring.change === 'down' && <ChevronDown size={14} className="text-red-500" />}
                      </div>
                      <p className="text-xs text-slate-500">{ring.membersCount} عضو</p>
                    </div>

                    {/* Mini stats */}
                    <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
                      <span title="حضور">حضور {ring.attendance}٪</span>
                      <span title="امتیاز مربی">مربی {ring.coachScore}</span>
                      <span title="لایک خارجی">{ring.externalLikes} لایک</span>
                    </div>

                    {/* Score */}
                    <div className="text-left">
                      <p className="text-lg font-bold text-okhovat-700">{ring.score}</p>
                      <p className="text-[10px] text-slate-400">امتیاز</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Scoring Rules */}
            <div className="mt-5 p-4 bg-white rounded-2xl border border-slate-100 text-sm text-slate-600 space-y-1">
              <p className="font-medium text-slate-800 mb-2">نحوه محاسبه امتیاز:</p>
              <p>• امتیاز مربی × <strong>۲</strong></p>
              <p>• درصد حضور اعضای حلقه × <strong>۲</strong></p>
              <p>• هر لایک از افراد خارج از حلقه روی برنامه حلقه = +۱ امتیاز</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

function PodiumCard({ ring, place, delay, highlight = false }: { ring: typeof ringsData[0]; place: number; delay: number; highlight?: boolean }) {
  const colors = {
    1: 'from-amber-400 to-amber-500',
    2: 'from-slate-300 to-slate-400',
    3: 'from-orange-300 to-orange-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-2xl p-4 text-center text-white bg-gradient-to-b ${colors[place as 1|2|3]} ${
        highlight ? 'scale-105 shadow-lg' : 'opacity-90'
      }`}
    >
      <div className="text-2xl mb-1">
        {place === 1 ? '🥇' : place === 2 ? '🥈' : '🥉'}
      </div>
      <p className="font-bold text-sm">{ring.name}</p>
      <p className="text-2xl font-black mt-1">{ring.score}</p>
      <p className="text-xs opacity-80 mt-0.5">{ring.attendance}٪ حضور</p>
    </motion.div>
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
