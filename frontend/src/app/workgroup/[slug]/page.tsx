'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import {
  Users, Wallet, BookOpen, Heart, Dumbbell, Package,
  Shield, Palette, Upload, ChevronLeft, Loader2
} from 'lucide-react'
import {
  getWorkgroupDetail,
  getWorkgroups,
  createWorkgroupContent,
  getMe,
  getUser,
  searchUsers,
} from '@/lib/api'

const META: Record<
  string,
  { icon: React.ReactNode; color: string; fallbackDesc: string }
> = {
  paziresh: { icon: <Users size={22} />, color: 'bg-blue-500', fallbackDesc: 'مدیریت ورود و عضویت' },
  mali: { icon: <Wallet size={22} />, color: 'bg-emerald-500', fallbackDesc: 'هزینه‌ها و بدهکاران' },
  amoozesh: { icon: <BookOpen size={22} />, color: 'bg-indigo-500', fallbackDesc: 'برنامه‌های آموزشی' },
  education: { icon: <BookOpen size={22} />, color: 'bg-indigo-500', fallbackDesc: 'برنامه‌های آموزشی' },
  'olum-eslami': { icon: <BookOpen size={22} />, color: 'bg-violet-500', fallbackDesc: 'کتابخوانی و معارف' },
  khadamat: { icon: <Heart size={22} />, color: 'bg-rose-500', fallbackDesc: 'خدمات عمومی' },
  'tarbiyat-badani': { icon: <Dumbbell size={22} />, color: 'bg-orange-500', fallbackDesc: 'ورزش و فعالیت بدنی' },
  tadarokat: { icon: <Package size={22} />, color: 'bg-amber-500', fallbackDesc: 'جمع و پخش' },
  sazmandehi: { icon: <Shield size={22} />, color: 'bg-slate-600', fallbackDesc: 'نظم و انضباط' },
  farhangi: { icon: <Palette size={22} />, color: 'bg-pink-500', fallbackDesc: 'فعالیت‌های فرهنگی' },
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

function mediaUrl(path?: string | null) {
  if (!path) return null
  if (path.startsWith('http')) return path
  const origin = API_BASE.replace(/\/api\/?$/, '')
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}

export default function WorkgroupPage() {
  const params = useParams()
  const slug = params.slug as string
  const fileRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [wg, setWg] = useState<any>(null)
  const [contents, setContents] = useState<any[]>([])
  const [allGroups, setAllGroups] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [memberOptions, setMemberOptions] = useState<any[]>([])
  const [expenseName, setExpenseName] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenses, setExpenses] = useState<{ name: string; amount: string }[]>([])
  const [taskType, setTaskType] = useState('')
  const [media, setMedia] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const meta = META[slug] || {
    icon: <Users size={22} />,
    color: 'bg-okhovat-500',
    fallbackDesc: '',
  }

  const isLeader =
    !!user &&
    (user.is_admin ||
      (user.is_workgroup_leader &&
        (user.workgroup?.slug === slug || user.workgroup?.id === wg?.id)))

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [detail, list] = await Promise.all([
        getWorkgroupDetail(slug),
        getWorkgroups().catch(() => []),
      ])
      setWg(detail.workgroup || detail)
      setContents(detail.contents || [])
      const groups = list.results || list || []
      setAllGroups(Array.isArray(groups) ? groups : [])

      try {
        const me = await getMe()
        setUser(me)
      } catch {
        setUser(getUser())
      }

      try {
        const users = await searchUsers()
        const u = users.results || users || []
        setMemberOptions(Array.isArray(u) ? u : [])
      } catch {
        setMemberOptions([])
      }
    } catch (err: any) {
      setError(err.message || 'کارگروه یافت نشد')
      setWg(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const toggleMember = (name: string) => {
    setSelectedMembers((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    )
  }

  const addExpense = () => {
    if (expenseName && expenseAmount) {
      setExpenses((prev) => [...prev, { name: expenseName, amount: expenseAmount }])
      setExpenseName('')
      setExpenseAmount('')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      const data: Record<string, unknown> = {
        members: selectedMembers,
        expenses: expenses.length ? expenses : undefined,
        task_type: taskType || undefined,
      }
      await createWorkgroupContent(slug, {
        title: title.trim() || undefined,
        body: body.trim() || undefined,
        data,
        media,
      })
      setSaveMsg('ذخیره و منتشر شد')
      setTitle('')
      setBody('')
      setSelectedMembers([])
      setExpenses([])
      setTaskType('')
      setMedia(null)
      if (fileRef.current) fileRef.current.value = ''
      await load()
    } catch (err: any) {
      setSaveMsg(err.message || 'خطا در ذخیره')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(''), 3000)
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

  if (!wg) {
    return (
      <AppShell>
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <p className="text-okhovat-500 mb-4">{error || 'کارگروه یافت نشد'}</p>
          <Link href="/" className="text-sm text-okhovat-600 hover:underline">
            بازگشت به خانه
          </Link>
        </div>
      </AppShell>
    )
  }

  const displaySlug = wg.slug || slug

  return (
    <AppShell userName={user?.full_name}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-okhovat-500 hover:text-okhovat-600 mb-4"
          >
            <ChevronLeft size={16} className="rotate-180" />
            خانه
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-14 h-14 rounded-2xl ${meta.color} flex items-center justify-center text-white shadow-md shrink-0`}
            >
              {meta.icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-okhovat-800 dark:text-okhovat-100">
                کارگروه {wg.name}
              </h1>
              <p className="text-sm text-okhovat-500 dark:text-okhovat-400">
                {wg.description || meta.fallbackDesc}
              </p>
            </div>
          </div>

          {allGroups.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {allGroups.map((g: any) => (
                <Link
                  key={g.id || g.slug}
                  href={`/workgroup/${g.slug || g.id}`}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${
                    displaySlug === g.slug
                      ? 'bg-okhovat-500 text-white border-okhovat-500'
                      : 'bg-white dark:bg-okhovat-900 text-okhovat-600 dark:text-okhovat-300 border-okhovat-200 dark:border-okhovat-700 hover:border-okhovat-400'
                  }`}
                >
                  {g.name}
                </Link>
              ))}
            </div>
          )}

          {isLeader && (
            <div className="card p-5 mb-5">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="font-semibold text-okhovat-800 dark:text-okhovat-100">پنل مسئول</h2>
                <span className="text-xs bg-okhovat-50 dark:bg-okhovat-900 text-okhovat-700 dark:text-okhovat-300 px-2.5 py-1 rounded-full">
                  شما مسئول این کارگروه هستید
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="عنوان (اختیاری)"
                  className="input-field"
                />
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="متن محتوا..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              {memberOptions.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-okhovat-700 dark:text-okhovat-200 mb-2">
                    انتخاب افراد
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {memberOptions.slice(0, 24).map((m: any) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleMember(m.full_name)}
                        className={`text-sm px-3 py-1.5 rounded-full border transition ${
                          selectedMembers.includes(m.full_name)
                            ? 'bg-okhovat-500 text-white border-okhovat-500'
                            : 'bg-white dark:bg-okhovat-900 text-okhovat-600 dark:text-okhovat-300 border-okhovat-200 dark:border-okhovat-700'
                        }`}
                      >
                        {m.full_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(displaySlug === 'mali' || wg.name?.includes('مالی')) && (
                <div className="space-y-3 pt-3 border-t border-okhovat-100 dark:border-okhovat-800 mb-3">
                  <p className="text-sm font-medium text-okhovat-700 dark:text-okhovat-200">ثبت هزینه</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={expenseName}
                      onChange={(e) => setExpenseName(e.target.value)}
                      placeholder="نام"
                      className="input-field flex-1"
                    />
                    <input
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      placeholder="مبلغ"
                      className="input-field sm:w-32"
                    />
                    <button type="button" onClick={addExpense} className="btn-primary px-4 py-2.5 text-sm">
                      افزودن
                    </button>
                  </div>
                  {expenses.length > 0 && (
                    <ul className="text-xs text-okhovat-600 space-y-1">
                      {expenses.map((e, i) => (
                        <li key={i}>
                          {e.name}: {e.amount}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {(displaySlug === 'tadarokat' || wg.name?.includes('تدارکات')) && (
                <div className="pt-3 border-t border-okhovat-100 dark:border-okhovat-800 mb-3">
                  <label className="block text-sm font-medium mb-2 text-okhovat-700 dark:text-okhovat-200">
                    نوع کار
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['جمع', 'پخش', 'شست‌وشو'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTaskType(t)}
                        className={`px-4 py-2 text-sm rounded-xl border transition ${
                          taskType === t
                            ? 'bg-okhovat-500 text-white border-okhovat-500'
                            : 'border-okhovat-200 dark:border-okhovat-700 text-okhovat-700 dark:text-okhovat-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-2 pt-3 border-t border-okhovat-100 dark:border-okhovat-800">
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setMedia(e.target.files?.[0] || null)}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 text-sm text-okhovat-600 dark:text-okhovat-400"
                >
                  <Upload size={16} />
                  {media ? media.name : 'بارگذاری عکس یا فایل'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="mt-4 w-full btn-primary py-2.5 disabled:opacity-60"
              >
                {saving ? 'در حال ذخیره...' : 'ذخیره و انتشار در داشبورد'}
              </button>
              {saveMsg && (
                <p className="text-xs text-center mt-2 text-okhovat-600 dark:text-okhovat-300">{saveMsg}</p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <h2 className="font-semibold text-okhovat-800 dark:text-okhovat-100 text-sm">
              محتوای کارگروه
            </h2>

            {contents.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-okhovat-400 text-sm">هنوز محتوایی ثبت نشده است</p>
              </div>
            ) : (
              contents.map((c) => (
                <div key={c.id} className="card p-5">
                  {c.title && (
                    <h3 className="text-sm font-semibold text-okhovat-800 dark:text-okhovat-100 mb-2">
                      {c.title}
                    </h3>
                  )}
                  {c.body && (
                    <p className="text-sm text-okhovat-600 dark:text-okhovat-300 whitespace-pre-wrap mb-2">
                      {c.body}
                    </p>
                  )}
                  {c.data?.members?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {c.data.members.map((name: string) => (
                        <span
                          key={name}
                          className="text-xs bg-okhovat-50 dark:bg-okhovat-900 text-okhovat-700 dark:text-okhovat-200 px-2.5 py-1 rounded-full"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                  {c.data?.expenses?.length > 0 && (
                    <div className="space-y-1 mb-2">
                      {c.data.expenses.map((e: any, i: number) => (
                        <div
                          key={i}
                          className="flex justify-between text-sm text-okhovat-700 dark:text-okhovat-200"
                        >
                          <span>{e.name}</span>
                          <span>{e.amount} تومان</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {c.data?.task_type && (
                    <p className="text-xs text-okhovat-500 mb-2">نوع کار: {c.data.task_type}</p>
                  )}
                  {c.media && (
                    <a
                      href={mediaUrl(c.media) || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-okhovat-600 hover:underline"
                    >
                      مشاهده فایل پیوست
                    </a>
                  )}
                  <p className="text-[11px] text-okhovat-400 mt-2">
                    {c.created_by || ''}
                    {c.created_at
                      ? ` · ${new Date(c.created_at).toLocaleDateString('fa-IR')}`
                      : ''}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}
