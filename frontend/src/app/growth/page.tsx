'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import {
  Dumbbell, BookOpen, Lightbulb, Users, Coffee,
  Calendar, CheckCircle2, Loader2, Upload
} from 'lucide-react'
import { createGrowthLog, getMe, getUser } from '@/lib/api'

const leisureOptions = ['خواب', 'ورزش', 'بازی', 'شبکه‌های اجتماعی']

export default function GrowthPage() {
  const [sport, setSport] = useState(0)
  const [study, setStudy] = useState(0)
  const [skillTopic, setSkillTopic] = useState('')
  const [skillLearn, setSkillLearn] = useState('')
  const [skillPractice, setSkillPractice] = useState('')
  const [responsibility, setResponsibility] = useState('')
  const [leisure, setLeisure] = useState<string[]>([])
  const [publish, setPublish] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [publishedHint, setPublishedHint] = useState(false)
  const [error, setError] = useState('')
  const [workgroup, setWorkgroup] = useState<any>(null)

  useEffect(() => {
    const cached = getUser()
    if (cached?.workgroup) setWorkgroup(cached.workgroup)
    getMe()
      .then((me) => {
        if (me?.workgroup) setWorkgroup(me.workgroup)
      })
      .catch(() => {})
  }, [])

  const toggleLeisure = (item: string) => {
    setLeisure((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setPublishedHint(false)
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await createGrowthLog({
        date: today,
        sport_hours: sport,
        study_pages: study,
        group_responsibility: responsibility,
        personal_skill: [skillTopic, skillLearn, skillPractice].filter(Boolean).join(' | '),
        leisure: leisure.join('، '),
        publish_to_posts: publish,
        extra_data: {
          skill_topic: skillTopic,
          skill_learn: skillLearn,
          skill_practice: skillPractice,
          publish_to_posts: publish,
        },
      })
      setSubmitted(true)
      if (res.published_to_posts) setPublishedHint(true)
      setTimeout(() => {
        setSubmitted(false)
        setPublishedHint(false)
      }, 3500)
      setSport(0)
      setStudy(0)
      setSkillTopic('')
      setSkillLearn('')
      setSkillPractice('')
      setResponsibility('')
      setLeisure([])
      setPublish(false)
    } catch (err: any) {
      setError(err.message || 'خطا در ثبت. ابتدا وارد شوید.')
    } finally {
      setLoading(false)
    }
  }

  const todayLabel = new Date().toLocaleDateString('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-5">
            <h1 className="text-xl font-bold text-okhovat-800 dark:text-okhovat-100">رشد فردی</h1>
            <p className="text-sm text-okhovat-500 dark:text-okhovat-400 mt-1 flex items-center gap-1.5">
              <Calendar size={14} />
              {todayLabel}
            </p>
          </div>

          <div className="flex gap-2 mb-5">
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-orange-900/40"
            >
              <Dumbbell size={13} /> برنامه ورزشی
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40"
            >
              <BookOpen size={13} /> کتاب
            </button>
          </div>

          <form onSubmit={handleSubmit} className="card overflow-hidden">
            <div className="p-5 border-b border-okhovat-100 dark:border-okhovat-800 bg-okhovat-50/50 dark:bg-okhovat-900/40">
              <h2 className="font-semibold text-okhovat-800 dark:text-okhovat-100">امروزت چطور گذشت؟</h2>
              <p className="text-sm text-okhovat-500 dark:text-okhovat-400 mt-0.5">
                ثبت ورزش، مطالعه، مهارت و فعالیت‌های روزانه
              </p>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-okhovat-50 dark:bg-okhovat-900 border border-okhovat-100 dark:border-okhovat-800">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                      <Dumbbell size={15} className="text-orange-600" />
                    </div>
                    <span className="text-sm font-medium text-okhovat-800 dark:text-okhovat-100">ورزش</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={sport}
                      onChange={(e) => setSport(Number(e.target.value))}
                      className="input-field"
                    />
                    <span className="text-xs text-okhovat-500 whitespace-nowrap">ساعت</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-okhovat-50 dark:bg-okhovat-900 border border-okhovat-100 dark:border-okhovat-800">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                      <BookOpen size={15} className="text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-okhovat-800 dark:text-okhovat-100">مطالعه</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={study}
                      onChange={(e) => setStudy(Number(e.target.value))}
                      className="input-field"
                    />
                    <span className="text-xs text-okhovat-500 whitespace-nowrap">صفحه</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-okhovat-800 dark:text-okhovat-100">
                  <Lightbulb size={16} className="text-amber-500" /> مهارت
                </label>
                <input
                  value={skillTopic}
                  onChange={(e) => setSkillTopic(e.target.value)}
                  placeholder="عنوان مبحث"
                  className="input-field"
                />
                <textarea
                  value={skillLearn}
                  onChange={(e) => setSkillLearn(e.target.value)}
                  placeholder="چه چیزی یاد گرفتی؟"
                  rows={2}
                  className="input-field resize-none"
                />
                <textarea
                  value={skillPractice}
                  onChange={(e) => setSkillPractice(e.target.value)}
                  placeholder="چه تمرینی انجام دادی؟"
                  rows={2}
                  className="input-field resize-none"
                />
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs text-okhovat-600 dark:text-okhovat-400 hover:text-okhovat-500"
                >
                  <Upload size={13} /> بارگذاری مستندات
                </button>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-okhovat-800 dark:text-okhovat-100 mb-2">
                  <Users size={16} className="text-okhovat-500" /> مسئولیت گروهی
                </label>
                <textarea
                  value={responsibility}
                  onChange={(e) => setResponsibility(e.target.value)}
                  placeholder="امروز چه مسئولیتی در گروه انجام دادی؟"
                  rows={2}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-okhovat-800 dark:text-okhovat-100 mb-2">
                  <Coffee size={16} className="text-purple-500" /> اوقات فراغت
                </label>
                <div className="flex flex-wrap gap-2">
                  {leisureOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleLeisure(item)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        leisure.includes(item)
                          ? 'bg-okhovat-500 text-white border-okhovat-500'
                          : 'bg-white dark:bg-okhovat-900 text-okhovat-600 dark:text-okhovat-300 border-okhovat-200 dark:border-okhovat-700 hover:border-okhovat-400'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-okhovat-50 dark:bg-okhovat-900 border border-okhovat-100 dark:border-okhovat-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publish}
                  onChange={(e) => setPublish(e.target.checked)}
                  className="mt-0.5 rounded text-okhovat-500 focus:ring-okhovat-500"
                />
                <div>
                  <p className="text-sm font-medium text-okhovat-800 dark:text-okhovat-100">
                    گزارشم در پست‌ها منتشر شود
                  </p>
                  <p className="text-xs text-okhovat-500 dark:text-okhovat-400 mt-0.5">
                    پیش‌فرض خاموش است؛ با تیک زدن یک پست از نوع «رشد» ساخته می‌شود
                  </p>
                </div>
              </label>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              {publishedHint && (
                <p className="text-sm text-emerald-600 text-center">
                  گزارش ثبت و در{' '}
                  <Link href="/posts" className="underline">
                    پست‌ها
                  </Link>{' '}
                  منتشر شد.
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : submitted ? (
                  <>
                    <CheckCircle2 size={18} /> ثبت شد!
                  </>
                ) : (
                  'ثبت رشد امروز'
                )}
              </button>
            </div>
          </form>

          <div className="mt-5 card p-5">
            <h3 className="font-semibold text-okhovat-800 dark:text-okhovat-100 mb-2">فرم‌های کارگروه</h3>
            {workgroup?.slug || workgroup?.name ? (
              <div className="space-y-2">
                <p className="text-sm text-okhovat-600 dark:text-okhovat-300">
                  کارگروه شما: <strong>{workgroup.name}</strong>
                </p>
                <Link
                  href={`/workgroup/${workgroup.slug || workgroup.id}`}
                  className="inline-flex text-sm text-okhovat-600 hover:underline"
                >
                  رفتن به صفحه کارگروه و ثبت محتوا →
                </Link>
              </div>
            ) : (
              <p className="text-sm text-okhovat-500 dark:text-okhovat-400">
                اگر عضو کارگروه باشی، لینک فرم‌ها اینجا نمایش داده می‌شود.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}
