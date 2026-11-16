'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Home, FileText, User, Shield,
  Trash2, Ban, Users, Calendar,
  TrendingUp, AlertCircle, Loader2
} from 'lucide-react'
import { getPosts, deletePost, getAdminStats, suspendUser } from '@/lib/api'

function timeAgo(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return 'همین الان'
  if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`
  return `${Math.floor(diff / 86400)} روز پیش`
}

export default function AdminPanel() {
  const [tab, setTab] = useState<'posts' | 'reports'>('reports')
  const [posts, setPosts] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [suspendModal, setSuspendModal] = useState<{ userId: number; userName: string } | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      if (tab === 'posts') {
        const data = await getPosts()
        setPosts(data.results || data || [])
      } else {
        const data = await getAdminStats()
        setStats(data)
      }
    } catch (err: any) {
      setError(err.message || 'خطا در دریافت داده')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [tab])

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id)
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch (err: any) {
      alert(err.message || 'خطا در حذف')
    }
  }

  const handleSuspend = async (days: 1 | 3) => {
    if (!suspendModal) return
    try {
      await suspendUser(suspendModal.userId, days)
      alert(`${suspendModal.userName} به مدت ${days} روز تعلیق شد`)
      setSuspendModal(null)
    } catch (err: any) {
      alert(err.message || 'خطا در تعلیق')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-white">
              <Shield size={18} />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-sm">پنل مدیریت</h1>
              <p className="text-[11px] text-slate-400">ادمین سایت</p>
            </div>
          </div>
          <Link href="/" className="text-xs text-okhovat-600 hover:underline">بازگشت به خانه</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5">
        <div className="flex bg-white rounded-xl border border-slate-200 p-1 mb-5">
          <button
            onClick={() => setTab('reports')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
              tab === 'reports' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-700'
            }`}
          >گزارش‌ها</button>
          <button
            onClick={() => setTab('posts')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
              tab === 'posts' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-700'
            }`}
          >مدیریت پست‌ها</button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-slate-600" size={28} /></div>
        ) : error ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            <p>{error}</p>
            <button onClick={loadData} className="mt-3 text-okhovat-600 hover:underline">تلاش مجدد</button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {tab === 'reports' && stats ? (
              <motion.div key="reports" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-okhovat-600" /> فرم رشد فردی این هفته
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-emerald-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-emerald-600">{stats.growth_filled?.length || 0}</p>
                      <p className="text-xs text-emerald-700">پر کرده‌اند</p>
                    </div>
                    <div className="bg-rose-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-rose-600">{stats.growth_empty?.length || 0}</p>
                      <p className="text-xs text-rose-700">هیچ چیزی پر نکرده‌اند</p>
                    </div>
                  </div>
                  {(stats.growth_filled || []).length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-500">لیست پرکنندگان:</p>
                      {stats.growth_filled.map((u: any) => (
                        <div key={u.name} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 last:border-0">
                          <span className="text-slate-700">{u.name}</span>
                          <span className="text-xs bg-okhovat-50 text-okhovat-700 px-2 py-0.5 rounded-full">{u.nights} شب</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {(stats.growth_empty || []).length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <p className="text-xs font-medium text-rose-500 mb-2 flex items-center gap-1">
                        <AlertCircle size={12} /> بدون ثبت:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {stats.growth_empty.map((name: string) => (
                          <span key={name} className="text-xs bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full">{name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Users size={16} className="text-okhovat-600" /> کارگروه‌هایی که جلسه ثبت کرده‌اند
                  </h3>
                  {(stats.workgroup_meetings || []).length === 0 ? (
                    <p className="text-sm text-slate-400">موردی ثبت نشده</p>
                  ) : (
                    <div className="space-y-2">
                      {stats.workgroup_meetings.map((w: any) => (
                        <div key={w.name} className="flex items-center justify-between text-sm py-1.5">
                          <span className="text-slate-700">{w.name}</span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{w.count} جلسه</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Calendar size={16} className="text-okhovat-600" /> حلقه‌هایی که برنامه ثبت کرده‌اند
                  </h3>
                  {(stats.circle_programs || []).length === 0 ? (
                    <p className="text-sm text-slate-400">موردی ثبت نشده</p>
                  ) : (
                    <div className="space-y-2">
                      {stats.circle_programs.map((c: any) => (
                        <div key={c.name} className="flex items-center justify-between text-sm py-1.5">
                          <span className="text-slate-700">{c.name}</span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{c.count} برنامه</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : tab === 'posts' ? (
              <motion.div key="posts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                <p className="text-xs text-slate-400 mb-2">مدیریت و نظارت روی پست‌های منتشرشده</p>
                {posts.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400 text-sm">
                    پستی برای مدیریت وجود ندارد
                  </div>
                ) : (
                  posts.map(post => (
                    <div key={post.id} className="bg-white rounded-2xl border border-slate-100 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-slate-800">{post.user?.full_name || 'کاربر'}</span>
                            <span className="text-xs text-slate-400">{timeAgo(post.created_at)}</span>
                            {post.post_type === 'circle_program' && (
                              <span className="text-[10px] bg-okhovat-50 text-okhovat-600 px-1.5 py-0.5 rounded">برنامه حلقه</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2">{post.content}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50">
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="flex items-center gap-1.5 text-xs text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition"
                        >
                          <Trash2 size={14} /> حذف پست
                        </button>
                        {post.user?.id && (
                          <button
                            onClick={() => setSuspendModal({ userId: post.user.id, userName: post.user.full_name })}
                            className="flex items-center gap-1.5 text-xs text-amber-600 hover:bg-amber-50 px-2.5 py-1.5 rounded-lg transition"
                          >
                            <Ban size={14} /> تعلیق کاربر
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        )}
      </main>

      <AnimatePresence>
        {suspendModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSuspendModal(null)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl p-5 w-full max-w-xs shadow-xl">
              <h3 className="font-bold text-slate-800 mb-1">تعلیق کاربر</h3>
              <p className="text-sm text-slate-500 mb-4">{suspendModal.userName} را برای چه مدتی تعلیق می‌کنید؟</p>
              <div className="flex gap-2">
                <button onClick={() => handleSuspend(1)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-2.5 rounded-xl transition">۱ روز</button>
                <button onClick={() => handleSuspend(3)} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-2.5 rounded-xl transition">۳ روز</button>
              </div>
              <button onClick={() => setSuspendModal(null)} className="w-full mt-2 text-sm text-slate-400 hover:text-slate-600 py-2">انصراف</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-full shadow-lg px-2 py-1.5 flex items-center gap-1">
          <BottomNavItem href="/" icon={<Home size={18} />} label="خانه" />
          <BottomNavItem href="/posts" icon={<FileText size={18} />} label="پست‌ها" />
          <BottomNavItem href="/admin" icon={<Shield size={18} />} label="مدیریت" active />
          <BottomNavItem href="/profile" icon={<User size={18} />} label="پروفایل" />
        </div>
      </nav>
    </div>
  )
}

function BottomNavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-full transition ${
      active ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'
    }`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}
