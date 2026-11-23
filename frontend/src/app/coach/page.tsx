'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppShell from '@/components/AppShell'
import {
  Search, ChevronLeft, Users, BookOpen, Dumbbell,
  Activity, Calendar, Loader2, BarChart3, MessageSquare,
  Send, Star
} from 'lucide-react'
import { searchUsers, getGrowthLogs } from '@/lib/api'

export default function CoachPanel() {
  const [tab, setTab] = useState<'individual' | 'collective' | 'messages'>('individual')
  const [search, setSearch] = useState('')
  const [members, setMembers] = useState<any[]>([])
  const [selectedMember, setSelectedMember] = useState<any | null>(null)
  const [growthLogs, setGrowthLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingGrowth, setLoadingGrowth] = useState(false)
  const [selectedField, setSelectedField] = useState<'sport' | 'study' | 'attendance'>('sport')
  const [messageText, setMessageText] = useState('')
  const [messageSent, setMessageSent] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true)
      searchUsers(search || undefined)
        .then((data) => setMembers(data.results || data || []))
        .catch(() => setMembers([]))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  const selectMember = async (m: any) => {
    setSelectedMember(m)
    setLoadingGrowth(true)
    setMessageSent(false)
    try {
      const data = await getGrowthLogs(m.id)
      setGrowthLogs(data.results || data || [])
    } catch {
      setGrowthLogs([])
    } finally {
      setLoadingGrowth(false)
    }
  }

  const sendMessage = () => {
    if (!messageText.trim() || !selectedMember) return
    // UI-only until backend message API is wired
    setMessageSent(true)
    setMessageText('')
    setTimeout(() => setMessageSent(false), 2500)
  }

  return (
    <AppShell role="coach">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-gold-500 flex items-center justify-center text-white font-bold shadow-sm">
            م
          </div>
          <div>
            <h1 className="font-bold text-okhovat-800 dark:text-okhovat-100">پنل نظارتی مربی</h1>
            <p className="text-xs text-okhovat-500 dark:text-okhovat-400">مشاهده گزارش‌ها، رتبه‌بندی و پیام به اعضا</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white dark:bg-okhovat-900 rounded-xl border border-okhovat-100 dark:border-okhovat-800 p-1 mb-5">
          {(
            [
              { id: 'individual', label: 'نظرات فردی' },
              { id: 'collective', label: 'نظرات جمعی' },
              { id: 'messages', label: 'پیام‌ها' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
                tab === t.id
                  ? 'bg-okhovat-500 text-white shadow-sm'
                  : 'text-okhovat-500 hover:text-okhovat-700 dark:hover:text-okhovat-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'individual' && (
            <motion.div
              key="individual"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="relative">
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-okhovat-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجوی نام یا کد گروهی..."
                  className="input-field pr-10"
                />
              </div>

              {!selectedMember ? (
                <div className="card overflow-hidden">
                  {loading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="animate-spin text-okhovat-500" size={24} />
                    </div>
                  ) : members.length === 0 ? (
                    <div className="text-center py-10 text-okhovat-400 text-sm">عضوی یافت نشد</div>
                  ) : (
                    members.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => selectMember(m)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-okhovat-50 dark:hover:bg-okhovat-900/50 transition border-b border-okhovat-50 dark:border-okhovat-800 last:border-0 text-right"
                      >
                        <div className="w-9 h-9 rounded-full bg-okhovat-100 dark:bg-okhovat-800 text-okhovat-700 dark:text-okhovat-200 flex items-center justify-center text-sm font-bold">
                          {(m.full_name || '?')[0]}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-okhovat-800 dark:text-okhovat-100">{m.full_name}</p>
                          <p className="text-xs text-okhovat-400">{m.group_code}</p>
                        </div>
                        <ChevronLeft size={16} className="text-okhovat-300" />
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setSelectedMember(null)
                      setGrowthLogs([])
                    }}
                    className="text-sm text-okhovat-600 dark:text-okhovat-400 hover:underline"
                  >
                    ← بازگشت به لیست
                  </button>

                  {/* Member card */}
                  <div className="card p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-okhovat-500 text-white flex items-center justify-center text-lg font-bold">
                        {(selectedMember.full_name || '?')[0]}
                      </div>
                      <div>
                        <p className="font-bold text-okhovat-800 dark:text-okhovat-100">{selectedMember.full_name}</p>
                        <p className="text-xs text-okhovat-400">کد {selectedMember.group_code}</p>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-okhovat-700 dark:text-okhovat-200 mb-2 flex items-center gap-1.5">
                      <Activity size={14} /> گزارش‌های رشد
                    </h3>

                    {loadingGrowth ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="animate-spin text-okhovat-500" size={20} />
                      </div>
                    ) : growthLogs.length === 0 ? (
                      <p className="text-sm text-okhovat-400 py-4">ثبتی وجود ندارد</p>
                    ) : (
                      <div className="space-y-2">
                        {growthLogs.slice(0, 7).map((g: any) => (
                          <div key={g.id} className="bg-okhovat-50 dark:bg-okhovat-900 rounded-xl p-3 text-xs">
                            <p className="font-medium text-okhovat-700 dark:text-okhovat-200 mb-1">{g.date}</p>
                            <div className="grid grid-cols-2 gap-1 text-okhovat-500 dark:text-okhovat-400">
                              <span>ورزش: {g.sport_hours} ساعت</span>
                              <span>مطالعه: {g.study_pages} صفحه</span>
                              {g.group_responsibility && (
                                <span className="col-span-2">مسئولیت: {g.group_responsibility}</span>
                              )}
                              {g.personal_skill && (
                                <span className="col-span-2">مهارت: {g.personal_skill}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="card p-3 text-sm text-okhovat-700 dark:text-okhovat-200 hover:border-okhovat-300 transition flex items-center gap-2">
                      <Users size={16} className="text-okhovat-500" /> جلسات کارگروه
                    </button>
                    <button className="card p-3 text-sm text-okhovat-700 dark:text-okhovat-200 hover:border-okhovat-300 transition flex items-center gap-2">
                      <Calendar size={16} className="text-okhovat-500" /> برنامه حلقه
                    </button>
                  </div>

                  {/* Message to member */}
                  <div className="card p-4">
                    <h3 className="text-sm font-semibold text-okhovat-800 dark:text-okhovat-100 mb-2 flex items-center gap-1.5">
                      <MessageSquare size={14} /> پیام به عضو
                    </h3>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="پیام تشویقی یا یادآوری..."
                      rows={2}
                      className="input-field resize-none mb-2"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!messageText.trim()}
                      className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Send size={14} /> ارسال پیام
                    </button>
                    {messageSent && (
                      <p className="text-xs text-emerald-600 mt-2">پیام ثبت شد (نمایش در پروفایل عضو به‌زودی متصل می‌شود)</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {tab === 'collective' && (
            <motion.div
              key="collective"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'sport', label: 'ورزش', icon: <Dumbbell size={14} /> },
                  { id: 'study', label: 'مطالعه', icon: <BookOpen size={14} /> },
                  { id: 'attendance', label: 'حضور', icon: <Users size={14} /> },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedField(f.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                      selectedField === f.id
                        ? 'bg-okhovat-500 text-white'
                        : 'bg-white dark:bg-okhovat-900 text-okhovat-600 dark:text-okhovat-300 border border-okhovat-200 dark:border-okhovat-700'
                    }`}
                  >
                    {f.icon} {f.label}
                  </button>
                ))}
              </div>

              <div className="card p-5">
                <h3 className="text-sm font-semibold text-okhovat-700 dark:text-okhovat-200 mb-4 flex items-center gap-1.5">
                  <BarChart3 size={14} /> رده‌بندی{' '}
                  {selectedField === 'sport' ? 'ورزش' : selectedField === 'study' ? 'مطالعه' : 'حضور'}
                </h3>
                <p className="text-sm text-okhovat-400 text-center py-6">
                  داده‌های رتبه‌بندی جمعی به‌زودی از API محاسبه می‌شود
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3 text-center bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-0.5">۱۰ نفر اول</p>
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">فعال‌ترین‌ها</p>
                </div>
                <div className="rounded-xl p-3 text-center bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
                  <p className="text-xs text-rose-600 dark:text-rose-400 mb-0.5">۱۰ نفر آخر</p>
                  <p className="text-sm font-bold text-rose-700 dark:text-rose-300">نیاز به توجه</p>
                </div>
              </div>

              {/* Grading forms placeholder from design */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-okhovat-800 dark:text-okhovat-100 mb-3 flex items-center gap-1.5">
                  <Star size={14} className="text-gold-500" /> امتیازدهی حلقه و کارگروه
                </h3>
                <p className="text-sm text-okhovat-500 dark:text-okhovat-400 mb-3">
                  انتخاب حلقه یا کارگروه و ثبت امتیاز از فهرست
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <select className="input-field text-sm">
                    <option>انتخاب حلقه...</option>
                    <option>سلمان</option>
                    <option>ابوذر</option>
                    <option>مقداد</option>
                  </select>
                  <select className="input-field text-sm">
                    <option>امتیاز...</option>
                    <option>۹–۱۰ عالی</option>
                    <option>۷–۸ خوب</option>
                    <option>۵–۶ متوسط</option>
                    <option>زیر ۵ نیاز به پیگیری</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="card p-5">
                <h3 className="font-semibold text-okhovat-800 dark:text-okhovat-100 mb-2 flex items-center gap-2">
                  <MessageSquare size={16} className="text-okhovat-500" /> آرشیو پیام‌ها
                </h3>
                <p className="text-sm text-okhovat-400 py-6 text-center">
                  پیام‌های ارسالی به اعضا اینجا آرشیو می‌شوند. اتصال کامل پس از API پیام فعال می‌شود.
                </p>
              </div>
              <p className="text-xs text-okhovat-400 text-center">
                برای ارسال پیام، از تب «نظرات فردی» عضو را انتخاب کنید.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  )
}
