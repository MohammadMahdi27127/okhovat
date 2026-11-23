'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import {
  Camera, LogOut, BookOpen, Dumbbell, MessageSquare, Users,
  Loader2, Activity
} from 'lucide-react'
import {
  getMe, getUser, saveUser, clearTokens, uploadAvatar, getGrowthLogs,
  getMessages, markMessageRead,
} from '@/lib/api'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

function mediaUrl(path?: string | null) {
  if (!path) return null
  if (path.startsWith('http')) return path
  const origin = API_BASE.replace(/\/api\/?$/, '')
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}

function timeAgo(dateStr: string) {
  const d = new Date(dateStr)
  const diff = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diff < 60) return 'همین الان'
  if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`
  return `${Math.floor(diff / 86400)} روز پیش`
}

export default function ProfilePage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [user, setUser] = useState<any>(null)
  const [recentGrowth, setRecentGrowth] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const me = await getMe()
      setUser(me)
      saveUser(me)
      try {
        const logs = await getGrowthLogs()
        const list = logs.results || logs || []
        setRecentGrowth(Array.isArray(list) ? list.slice(0, 3) : [])
      } catch {
        setRecentGrowth([])
      }
      try {
        const msgs = await getMessages({ inbox: true })
        const list = msgs.results || msgs || []
        setMessages(Array.isArray(list) ? list : [])
        // mark unread as read (best-effort)
        for (const m of list) {
          if (m && !m.is_read && m.id) {
            markMessageRead(m.id).catch(() => {})
          }
        }
      } catch {
        setMessages([])
      }
    } catch {
      const cached = getUser()
      if (cached) {
        setUser(cached)
        setError('اتصال به سرور برقرار نشد؛ دادهٔ ذخیره‌شده نمایش داده می‌شود.')
      } else {
        setError('برای مشاهده پروفایل وارد شوید.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleLogout = () => {
    clearTokens()
    router.push('/login')
  }

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const data = await uploadAvatar(file)
      const next = data.user || { ...user, avatar: data.avatar }
      setUser(next)
      saveUser(next)
    } catch (err: any) {
      setError(err.message || 'خطا در آپلود آواتار')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-okhovat-500" size={28} />
        </div>
      </AppShell>
    )
  }

  if (!user) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <p className="text-okhovat-600 dark:text-okhovat-300 mb-4">
            {error || 'برای مشاهده پروفایل وارد شوید.'}
          </p>
          <Link href="/login" className="btn-primary inline-block px-5 py-2.5 text-sm">
            ورود به اخوت
          </Link>
        </div>
      </AppShell>
    )
  }

  const initial = (user.full_name || '?')[0]
  const avatarSrc = mediaUrl(user.avatar)
  const ringName = user.ring?.name
  const ringAvg = user.ring?.attendance_avg
  const workgroupName = user.workgroup?.name
  const postsCount = user.posts_count ?? 0
  const growthCount = user.growth_logs_count ?? 0
  const myAttendance = user.attendance_percentage ?? 0
  const activity = user.activity_level ?? 1

  const roleLabel = user.is_admin
    ? 'مدیر'
    : user.is_coach
    ? 'مربی'
    : user.is_ring_leader
    ? 'سر حلقه'
    : user.is_workgroup_leader
    ? 'مسئول کارگروه'
    : 'عضو'

  return (
    <AppShell
      role={user.is_admin ? 'admin' : user.is_coach ? 'coach' : 'member'}
      userName={user.full_name}
    >
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-bold text-okhovat-800 dark:text-okhovat-100">پروفایل</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 px-3 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition"
            >
              <LogOut size={16} />
              خروج
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
              {error}
            </div>
          )}

          <div className="card p-5 mb-4">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={user.full_name}
                    className="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-white dark:border-okhovat-800"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-okhovat-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {initial}
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleAvatar}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-1 -left-1 w-7 h-7 bg-white dark:bg-okhovat-800 rounded-full border border-okhovat-100 dark:border-okhovat-700 flex items-center justify-center shadow-sm disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 size={13} className="animate-spin text-okhovat-600" />
                  ) : (
                    <Camera size={13} className="text-okhovat-600 dark:text-okhovat-300" />
                  )}
                </button>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-okhovat-800 dark:text-okhovat-100 truncate">
                  {user.full_name}
                </h2>
                <p className="text-sm text-okhovat-500 dark:text-okhovat-400 mt-0.5">
                  کد گروهی: {user.group_code}
                  {ringName ? ` · حلقه ${ringName}` : ''}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-okhovat-50 dark:bg-okhovat-900 text-okhovat-600 dark:text-okhovat-300">
                    {roleLabel}
                  </span>
                  {workgroupName && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-okhovat-50 dark:bg-okhovat-900 text-okhovat-600 dark:text-okhovat-300">
                      کارگروه {workgroupName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <StatBox label="پست" value={String(postsCount)} />
            <StatBox label="گزارش رشد" value={String(growthCount)} />
            <StatBox label="سطح فعالیت" value={String(activity)} />
            <StatBox
              label="حضور"
              value={`${typeof myAttendance === 'number' ? Math.round(myAttendance) : myAttendance}٪`}
            />
          </div>

          <div className="card p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-okhovat-500" />
              <h3 className="font-semibold text-okhovat-800 dark:text-okhovat-100">حضور</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-okhovat-50 dark:bg-okhovat-900 text-center">
                <p className="text-xl font-bold text-okhovat-700 dark:text-okhovat-200">
                  {typeof myAttendance === 'number' ? Math.round(myAttendance) : myAttendance}٪
                </p>
                <p className="text-xs text-okhovat-500 mt-0.5">حضور من</p>
              </div>
              <div className="p-3 rounded-xl bg-okhovat-50 dark:bg-okhovat-900 text-center">
                <p className="text-xl font-bold text-okhovat-700 dark:text-okhovat-200">
                  {ringAvg != null ? `${Math.round(ringAvg)}٪` : '—'}
                </p>
                <p className="text-xs text-okhovat-500 mt-0.5">میانگین حلقه</p>
              </div>
            </div>
          </div>

          <div className="card p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-okhovat-800 dark:text-okhovat-100 flex items-center gap-2">
                <Activity size={16} className="text-okhovat-500" />
                آخرین گزارش‌های رشد
              </h3>
              <Link href="/growth" className="text-xs text-okhovat-600 hover:underline">
                ثبت امروز
              </Link>
            </div>
            {recentGrowth.length === 0 ? (
              <p className="text-sm text-okhovat-400 py-2">هنوز گزارشی ثبت نکرده‌ای.</p>
            ) : (
              <div className="space-y-2">
                {recentGrowth.map((g) => (
                  <div
                    key={g.id}
                    className="p-3 rounded-xl bg-okhovat-50 dark:bg-okhovat-900 text-xs text-okhovat-600 dark:text-okhovat-300"
                  >
                    <p className="font-medium text-okhovat-800 dark:text-okhovat-100 mb-1">{g.date}</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Dumbbell size={12} /> {g.sport_hours || 0} ساعت
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BookOpen size={12} /> {g.study_pages || 0} صفحه
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-5 mb-4">
            <h3 className="font-semibold text-okhovat-800 dark:text-okhovat-100 mb-3">وضعیت من</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-okhovat-50 dark:bg-okhovat-900">
                <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                  <Dumbbell size={16} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-okhovat-800 dark:text-okhovat-100">برنامه ورزشی</p>
                  <p className="text-xs text-okhovat-500">
                    {recentGrowth[0]?.sport_hours
                      ? `آخرین ثبت: ${recentGrowth[0].sport_hours} ساعت`
                      : 'هنوز تنظیم نشده'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-okhovat-50 dark:bg-okhovat-900">
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <BookOpen size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-okhovat-800 dark:text-okhovat-100">مطالعه اخیر</p>
                  <p className="text-xs text-okhovat-500">
                    {recentGrowth[0]?.study_pages
                      ? `آخرین ثبت: ${recentGrowth[0].study_pages} صفحه`
                      : 'هنوز انتخاب نشده'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coach messages from API */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={18} className="text-okhovat-500" />
              <h3 className="font-semibold text-okhovat-800 dark:text-okhovat-100">پیام‌های مربی</h3>
            </div>
            {messages.length === 0 ? (
              <p className="text-sm text-okhovat-400 py-2">هنوز پیامی از مربی نرسیده است.</p>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40"
                  >
                    <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed whitespace-pre-wrap">
                      {m.body}
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                      {m.sender?.full_name || 'مربی'}
                      {m.created_at ? ` · ${timeAgo(m.created_at)}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-3.5 text-center">
      <p className="text-xl font-bold text-okhovat-700 dark:text-okhovat-200">{value}</p>
      <p className="text-xs text-okhovat-500 dark:text-okhovat-400 mt-0.5">{label}</p>
    </div>
  )
}
