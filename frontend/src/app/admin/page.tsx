'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppShell from '@/components/AppShell'
import {
  Shield, Trash2, Ban, Users, Calendar,
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
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

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
      setPosts((prev) => prev.filter((p) => p.id !== id))
      setDeleteConfirm(null)
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
    <AppShell role="admin">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-okhovat-800 dark:bg-okhovat-700 flex items-center justify-center text-white shadow-sm">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="font-bold text-okhovat-800 dark:text-okhovat-100">پنل مدیریت</h1>
            <p className="text-xs text-okhovat-500 dark:text-okhovat-400">گزارش‌ها و مدیریت پست‌ها</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white dark:bg-okhovat-900 rounded-xl border border-okhovat-100 dark:border-okhovat-800 p-1 mb-5">
          <button
            onClick={() => setTab('reports')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
              tab === 'reports'
                ? 'bg-okhovat-800 dark:bg-okhovat-600 text-white'
                : 'text-okhovat-500 hover:text-okhovat-700 dark:hover:text-okhovat-300'
            }`}
          >
            گزارش‌ها
          </button>
          <button
            onClick={() => setTab('posts')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
              tab === 'posts'
                ? 'bg-okhovat-800 dark:bg-okhovat-600 text-white'
                : 'text-okhovat-500 hover:text-okhovat-700 dark:hover:text-okhovat-300'
            }`}
          >
            مدیریت پست‌ها
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-okhovat-500" size={28} />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-okhovat-500 text-sm">
            <p>{error}</p>
            <button onClick={loadData} className="mt-3 text-okhovat-600 hover:underline">
              تلاش مجدد
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {tab === 'reports' && stats && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Growth this week */}
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-okhovat-800 dark:text-okhovat-100 mb-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-okhovat-500" /> فرم رشد فردی این هفته
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-xl p-3 text-center bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {stats.growth_filled?.length || 0}
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">پر کرده‌اند</p>
                    </div>
                    <div className="rounded-xl p-3 text-center bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
                      <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                        {stats.growth_empty?.length || 0}
                      </p>
                      <p className="text-xs text-rose-700 dark:text-rose-300">هیچ چیزی پر نکرده‌اند</p>
                    </div>
                  </div>

                  {(stats.growth_filled || []).length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-okhovat-500">لیست پرکنندگان:</p>
                      {stats.growth_filled.map((u: any) => (
                        <div
                          key={u.name}
                          className="flex items-center justify-between text-sm py-1.5 border-b border-okhovat-50 dark:border-okhovat-800 last:border-0"
                        >
                          <span className="text-okhovat-700 dark:text-okhovat-200">{u.name}</span>
                          <span className="text-xs bg-okhovat-50 dark:bg-okhovat-900 text-okhovat-700 dark:text-okhovat-300 px-2 py-0.5 rounded-full">
                            {u.nights} شب
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {(stats.growth_empty || []).length > 0 && (
                    <div className="mt-4 pt-3 border-t border-okhovat-100 dark:border-okhovat-800">
                      <p className="text-xs font-medium text-rose-500 mb-2 flex items-center gap-1">
                        <AlertCircle size={12} /> بدون ثبت:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {stats.growth_empty.map((name: string) => (
                          <span
                            key={name}
                            className="text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 px-2.5 py-1 rounded-full"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Workgroups */}
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-okhovat-800 dark:text-okhovat-100 mb-3 flex items-center gap-2">
                    <Users size={16} className="text-okhovat-500" /> کارگروه‌هایی که جلسه ثبت کرده‌اند
                  </h3>
                  {(stats.workgroup_meetings || []).length === 0 ? (
                    <p className="text-sm text-okhovat-400">موردی ثبت نشده</p>
                  ) : (
                    <div className="space-y-2">
                      {stats.workgroup_meetings.map((w: any) => (
                        <div key={w.name} className="flex items-center justify-between text-sm py-1.5">
                          <span className="text-okhovat-700 dark:text-okhovat-200">{w.name}</span>
                          <span className="text-xs bg-okhovat-50 dark:bg-okhovat-900 text-okhovat-600 dark:text-okhovat-300 px-2 py-0.5 rounded-full">
                            {w.count} جلسه
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Circles */}
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-okhovat-800 dark:text-okhovat-100 mb-3 flex items-center gap-2">
                    <Calendar size={16} className="text-okhovat-500" /> حلقه‌هایی که برنامه ثبت کرده‌اند
                  </h3>
                  {(stats.circle_programs || []).length === 0 ? (
                    <p className="text-sm text-okhovat-400">موردی ثبت نشده</p>
                  ) : (
                    <div className="space-y-2">
                      {stats.circle_programs.map((c: any) => (
                        <div key={c.name} className="flex items-center justify-between text-sm py-1.5">
                          <span className="text-okhovat-700 dark:text-okhovat-200">{c.name}</span>
                          <span className="text-xs bg-okhovat-50 dark:bg-okhovat-900 text-okhovat-600 dark:text-okhovat-300 px-2 py-0.5 rounded-full">
                            {c.count} برنامه
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {tab === 'posts' && (
              <motion.div
                key="posts"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <p className="text-xs text-okhovat-400 mb-1">مدیریت و نظارت روی پست‌های منتشرشده</p>
                {posts.length === 0 ? (
                  <div className="card p-8 text-center text-okhovat-400 text-sm">
                    پستی برای مدیریت وجود ندارد
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-medium text-okhovat-800 dark:text-okhovat-100">
                              {post.user?.full_name || 'کاربر'}
                            </span>
                            <span className="text-xs text-okhovat-400">{timeAgo(post.created_at)}</span>
                            {post.post_type === 'circle_program' && (
                              <span className="text-[10px] bg-okhovat-50 dark:bg-okhovat-900 text-okhovat-600 dark:text-okhovat-300 px-1.5 py-0.5 rounded">
                                برنامه حلقه
                              </span>
                            )}
                            {post.post_type === 'coach' && (
                              <span className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-gold-600 dark:text-gold-400 px-1.5 py-0.5 rounded">
                                پست مربی
                              </span>
                            )}
                          </div>
                          {post.title && (
                            <p className="text-sm font-medium text-okhovat-700 dark:text-okhovat-200 mb-0.5">
                              {post.title}
                            </p>
                          )}
                          <p className="text-sm text-okhovat-600 dark:text-okhovat-300 line-clamp-2">
                            {post.content}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-okhovat-50 dark:border-okhovat-800">
                        {deleteConfirm === post.id ? (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-rose-600">مطمئنی؟</span>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="bg-rose-500 text-white px-2.5 py-1 rounded-lg hover:bg-rose-600"
                            >
                              حذف
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-okhovat-500 px-2 py-1"
                            >
                              انصراف
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(post.id)}
                            className="flex items-center gap-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-2.5 py-1.5 rounded-lg transition"
                          >
                            <Trash2 size={14} /> حذف پست
                          </button>
                        )}
                        {post.user?.id && (
                          <button
                            onClick={() =>
                              setSuspendModal({
                                userId: post.user.id,
                                userName: post.user.full_name,
                              })
                            }
                            className="flex items-center gap-1.5 text-xs text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 px-2.5 py-1.5 rounded-lg transition"
                          >
                            <Ban size={14} /> تعلیق کاربر
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Suspend modal */}
      <AnimatePresence>
        {suspendModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSuspendModal(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white dark:bg-okhovat-900 rounded-2xl p-5 w-full max-w-xs shadow-xl border border-okhovat-100 dark:border-okhovat-800"
            >
              <h3 className="font-bold text-okhovat-800 dark:text-okhovat-100 mb-1">تعلیق کاربر</h3>
              <p className="text-sm text-okhovat-500 dark:text-okhovat-400 mb-4">
                {suspendModal.userName} را برای چه مدتی تعلیق می‌کنید؟
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSuspend(1)}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-2.5 rounded-xl transition"
                >
                  ۱ روز
                </button>
                <button
                  onClick={() => handleSuspend(3)}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-2.5 rounded-xl transition"
                >
                  ۳ روز
                </button>
              </div>
              <button
                onClick={() => setSuspendModal(null)}
                className="w-full mt-2 text-sm text-okhovat-400 hover:text-okhovat-600 py-2"
              >
                انصراف
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppShell>
  )
}
