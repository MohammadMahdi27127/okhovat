'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Preloader from '@/components/Preloader'
import LoginModal from '@/components/LoginModal'
import AppShell from '@/components/AppShell'
import { MessageCircle, Calendar, Users, BookOpen, TrendingUp, ChevronLeft, Loader2 } from 'lucide-react'
import { getWorkgroups, getRings, getPosts, getUser } from '@/lib/api'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [workgroups, setWorkgroups] = useState<any[]>([])
  const [rings, setRings] = useState<any[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const user = typeof window !== 'undefined' ? getUser() : null

  useEffect(() => {
    if (loading) return
    setDataLoading(true)
    Promise.all([
      getWorkgroups().catch(() => []),
      getRings().catch(() => []),
      getPosts().catch(() => ({ results: [] })),
    ])
      .then(([wg, ringsData, postsData]) => {
        const groups = wg.results || wg || []
        setWorkgroups(Array.isArray(groups) ? groups : [])
        const r = ringsData.results || ringsData || []
        setRings(Array.isArray(r) ? r.slice(0, 5) : [])
        const posts = postsData.results || postsData || []
        const prog = (Array.isArray(posts) ? posts : []).filter(
          (p: any) =>
            p.post_type === 'circle_program' || p.post_type === 'workgroup_meeting'
        )
        setPrograms(prog.slice(0, 5))
      })
      .finally(() => setDataLoading(false))
  }, [loading])

  if (loading) {
    return <Preloader onComplete={() => setLoading(false)} />
  }

  return (
    <AppShell onLoginClick={() => setShowLogin(true)} userName={user?.full_name}>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-okhovat-800 dark:text-okhovat-100 mb-4"
        >
          خانهٔ اخوت
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-okhovat-500 rounded-2xl p-5 md:p-6 text-white mb-6 shadow-lg relative overflow-hidden"
        >
          <div className="absolute -left-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
              ا
            </div>
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-bold mb-1">
                {user?.full_name ? `سلام ${user.full_name}` : 'سلام دوست عزیز'}
              </h2>
              <p className="text-okhovat-100 text-sm leading-relaxed">
                به سامانهٔ اخوت خوش آمدی. اگر کمکی خواستی، همراه اخوت اینجاست.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/assistant"
                  className="inline-flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-okhovat-900 px-4 py-2 rounded-xl text-sm font-medium transition"
                >
                  <MessageCircle size={16} />
                  گفت‌وگو با همراه اخوت
                </Link>
                {!user && (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                  >
                    ورود به حساب
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {dataLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-okhovat-500" size={24} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              <Section title="برنامه‌های هفته" icon={<Calendar size={18} />}>
                {programs.length === 0 ? (
                  <p className="text-sm text-okhovat-400 py-2">برنامه‌ای ثبت نشده است.</p>
                ) : (
                  programs.map((p) => (
                    <ProgramCard
                      key={p.id}
                      title={p.title || (p.post_type === 'circle_program' ? 'برنامه حلقه' : 'جلسه کارگروه')}
                      desc={(p.content || '').slice(0, 80)}
                      href="/posts"
                    />
                  ))
                )}
              </Section>

              <Section title="کارگروه‌ها" icon={<BookOpen size={18} />}>
                {workgroups.length === 0 ? (
                  <p className="text-sm text-okhovat-400 py-2">کارگروهی ثبت نشده است.</p>
                ) : (
                  workgroups.map((g) => (
                    <ProgramCard
                      key={g.id}
                      title={g.name}
                      desc={g.description || 'مشاهده محتوا و پنل مسئول'}
                      href={`/workgroup/${g.slug || g.id}`}
                    />
                  ))
                )}
              </Section>
            </div>

            <div className="space-y-5">
              <Section title="گزارش روزانه" icon={<TrendingUp size={18} />}>
                <Link
                  href="/growth"
                  className="block p-4 rounded-xl bg-okhovat-50 dark:bg-okhovat-900 hover:bg-okhovat-100 dark:hover:bg-okhovat-800 transition text-sm text-okhovat-700 dark:text-okhovat-200"
                >
                  ثبت رشد امروز →
                </Link>
              </Section>

              <Section title="حلقه‌های پیشرو" icon={<Users size={18} />}>
                {rings.length === 0 ? (
                  <p className="text-sm text-okhovat-400 py-2">داده‌ای موجود نیست.</p>
                ) : (
                  <div className="space-y-2">
                    {rings.map((ring) => (
                      <Link
                        key={ring.id}
                        href="/rankings"
                        className="flex items-center justify-between p-2.5 rounded-xl bg-okhovat-50/80 dark:bg-okhovat-900/60 hover:bg-okhovat-100 dark:hover:bg-okhovat-800 transition"
                      >
                        <span className="text-sm text-okhovat-800 dark:text-okhovat-200">{ring.name}</span>
                        <span className="text-xs font-medium text-okhovat-500">
                          {ring.score != null ? `${ring.score} امتیاز` : ring.attendance_avg != null ? `${ring.attendance_avg}٪` : '—'}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </Section>
            </div>
          </div>
        )}
      </div>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={() => setShowLogin(false)}
      />
    </AppShell>
  )
}

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-okhovat-500">{icon}</span>
        <h3 className="font-semibold text-okhovat-800 dark:text-okhovat-100">{title}</h3>
      </div>
      {children}
    </motion.section>
  )
}

function ProgramCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-3.5 rounded-xl bg-okhovat-50/80 dark:bg-okhovat-900/50 hover:bg-okhovat-100 dark:hover:bg-okhovat-800 transition group mb-2 last:mb-0"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-okhovat-800 dark:text-okhovat-100">{title}</p>
        <p className="text-xs text-okhovat-500 dark:text-okhovat-400 mt-0.5 line-clamp-2">{desc}</p>
      </div>
      <ChevronLeft size={16} className="text-okhovat-400 group-hover:text-okhovat-600 transition shrink-0" />
    </Link>
  )
}
