'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppShell from '@/components/AppShell'
import {
  Search, ChevronLeft, Users, BookOpen, Dumbbell,
  Activity, Calendar, Loader2, BarChart3, MessageSquare,
  Send, Star
} from 'lucide-react'
import {
  searchUsers, getGrowthLogs, sendCoachMessage, getMessages,
  getMemberRankings, getRings, getWorkgroups, updateCoachScore, getPosts,
} from '@/lib/api'

function timeAgo(dateStr: string) {
  const d = new Date(dateStr)
  const diff = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diff < 60) return 'همین الان'
  if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`
  return `${Math.floor(diff / 86400)} روز پیش`
}

export default function CoachPanel() {
  const [tab, setTab] = useState<'individual' | 'collective' | 'messages'>('individual')
  const [search, setSearch] = useState('')
  const [members, setMembers] = useState<any[]>([])
  const [selectedMember, setSelectedMember] = useState<any | null>(null)
  const [growthLogs, setGrowthLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingGrowth, setLoadingGrowth] = useState(false)
  const [memberPosts, setMemberPosts] = useState<any[]>([])
  const [postPanel, setPostPanel] = useState<'workgroup' | 'circle' | null>(null)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [selectedField, setSelectedField] = useState<'sport' | 'study' | 'attendance'>('sport')
  const [messageText, setMessageText] = useState('')
  const [messageSent, setMessageSent] = useState(false)
  const [messageError, setMessageError] = useState('')
  const [sending, setSending] = useState(false)
  const [archive, setArchive] = useState<any[]>([])
  const [loadingArchive, setLoadingArchive] = useState(false)
  const [ranking, setRanking] = useState<{ top: any[]; bottom: any[] }>({ top: [], bottom: [] })
  const [loadingRank, setLoadingRank] = useState(false)
  const [rings, setRings] = useState<any[]>([])
  const [workgroups, setWorkgroups] = useState<any[]>([])
  const [scoreTarget, setScoreTarget] = useState<'ring' | 'workgroup'>('ring')
  const [scoreId, setScoreId] = useState('')
  const [scoreValue, setScoreValue] = useState('8')
  const [scoreMsg, setScoreMsg] = useState('')
  const [scoreSaving, setScoreSaving] = useState(false)

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

  useEffect(() => {
    if (tab !== 'messages') return
    setLoadingArchive(true)
    getMessages()
      .then((data) => {
        const list = data.results || data || []
        setArchive(Array.isArray(list) ? list : [])
      })
      .catch(() => setArchive([]))
      .finally(() => setLoadingArchive(false))
  }, [tab, messageSent])

  useEffect(() => {
    if (tab !== 'collective') return
    setLoadingRank(true)
    getMemberRankings({ field: selectedField, days: 7, limit: 10 })
      .then((data) => setRanking({ top: data.top || [], bottom: data.bottom || [] }))
      .catch(() => setRanking({ top: [], bottom: [] }))
      .finally(() => setLoadingRank(false))
  }, [tab, selectedField])

  useEffect(() => {
    if (tab !== 'collective') return
    Promise.all([getRings().catch(() => []), getWorkgroups().catch(() => [])]).then(([r, w]) => {
      setRings(r.results || r || [])
      setWorkgroups(w.results || w || [])
    })
  }, [tab])

  const selectMember = async (m: any) => {
    setSelectedMember(m)
    setLoadingGrowth(true)
    setMessageSent(false)
    setMessageError('')
    setPostPanel(null)
    setMemberPosts([])
    try {
      const data = await getGrowthLogs(m.id)
      setGrowthLogs(data.results || data || [])
    } catch {
      setGrowthLogs([])
    } finally {
      setLoadingGrowth(false)
    }
  }

  const loadMemberPosts = async (type: 'workgroup_meeting' | 'circle_program') => {
    if (!selectedMember) return
    setPostPanel(type === 'workgroup_meeting' ? 'workgroup' : 'circle')
    setLoadingPosts(true)
    try {
      const data = await getPosts({ type, user: selectedMember.id })
      setMemberPosts(data.results || data || [])
    } catch {
      setMemberPosts([])
    } finally {
      setLoadingPosts(false)
    }
  }

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedMember) return
    setSending(true)
    setMessageError('')
    try {
      await sendCoachMessage(selectedMember.id, messageText.trim())
      setMessageSent(true)
      setMessageText('')
      setTimeout(() => setMessageSent(false), 2500)
    } catch (err: any) {
      setMessageError(err.message || 'ارسال ناموفق بود')
    } finally {
      setSending(false)
    }
  }

  const submitScore = async () => {
    if (!scoreId) {
      setScoreMsg('یک مورد انتخاب کن')
      return
    }
    setScoreSaving(true)
    setScoreMsg('')
    try {
      const res = await updateCoachScore({
        target: scoreTarget,
        id: Number(scoreId),
        score: Number(scoreValue),
      })
      setScoreMsg(
        scoreTarget === 'ring'
          ? `امتیاز حلقه ${res.name}: مربی ${res.coach_score} · کل ${res.score} · رتبه ${res.rank}`
          : `امتیاز کارگروه ${res.name}: ${res.score}`
      )
    } catch (err: any) {
      setScoreMsg(err.message || 'خطا در ذخیره')
    } finally {
      setScoreSaving(false)
    }
  }

  return (
    <AppShell role="coach">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-gold-500 flex items-center justify-center text-white font-bold shadow-sm">م</div>
          <div>
            <h1 className="font-bold text-okhovat-800 dark:text-okhovat-100">پنل نظارتی مربی</h1>
            <p className="text-xs text-okhovat-500 dark:text-okhovat-400">مشاهده گزارش‌ها، رتبه‌بندی و پیام به اعضا</p>
          </div>
        </div>

        <div className="flex bg-white dark:bg-okhovat-900 rounded-xl border border-okhovat-100 dark:border-okhovat-800 p-1 mb-5">
          {([{ id: 'individual', label: 'نظرات فردی' }, { id: 'collective', label: 'نظرات جمعی' }, { id: 'messages', label: 'پیام‌ها' }] as const).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${tab === t.id ? 'bg-okhovat-500 text-white shadow-sm' : 'text-okhovat-500 hover:text-okhovat-700 dark:hover:text-okhovat-300'}`}>{t.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'individual' && (
            <motion.div key="individual" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="relative">
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-okhovat-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجوی نام یا کد گروهی..." className="input-field pr-10" />
              </div>

              {!selectedMember ? (
                <div className="card overflow-hidden">
                  {loading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-okhovat-500" size={24} /></div> : members.length === 0 ? <div className="text-center py-10 text-okhovat-400 text-sm">عضوی یافت نشد</div> : members.map((m) => (
                    <button key={m.id} onClick={() => selectMember(m)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-okhovat-50 dark:hover:bg-okhovat-900/50 transition border-b border-okhovat-50 dark:border-okhovat-800 last:border-0 text-right">
                      <div className="w-9 h-9 rounded-full bg-okhovat-100 dark:bg-okhovat-800 text-okhovat-700 dark:text-okhovat-200 flex items-center justify-center text-sm font-bold">{(m.full_name || '?')[0]}</div>
                      <div className="flex-1"><p className="text-sm font-medium text-okhovat-800 dark:text-okhovat-100">{m.full_name}</p><p className="text-xs text-okhovat-400">{m.group_code}</p></div>
                      <ChevronLeft size={16} className="text-okhovat-300" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <button onClick={() => { setSelectedMember(null); setGrowthLogs([]); setPostPanel(null) }} className="text-sm text-okhovat-600 dark:text-okhovat-400 hover:underline">← بازگشت به لیست</button>
                  <div className="card p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-okhovat-500 text-white flex items-center justify-center text-lg font-bold">{(selectedMember.full_name || '?')[0]}</div>
                      <div><p className="font-bold text-okhovat-800 dark:text-okhovat-100">{selectedMember.full_name}</p><p className="text-xs text-okhovat-400">کد {selectedMember.group_code}</p></div>
                    </div>
                    <h3 className="text-sm font-semibold text-okhovat-700 dark:text-okhovat-200 mb-2 flex items-center gap-1.5"><Activity size={14} /> گزارش‌های رشد</h3>
                    {loadingGrowth ? <div className="flex justify-center py-6"><Loader2 className="animate-spin text-okhovat-500" size={20} /></div> : growthLogs.length === 0 ? <p className="text-sm text-okhovat-400 py-4">ثبتی وجود ندارد</p> : (
                      <div className="space-y-2">{growthLogs.slice(0, 7).map((g: any) => (
                        <div key={g.id} className="bg-okhovat-50 dark:bg-okhovat-900 rounded-xl p-3 text-xs">
                          <p className="font-medium text-okhovat-700 dark:text-okhovat-200 mb-1">{g.date}</p>
                          <div className="grid grid-cols-2 gap-1 text-okhovat-500 dark:text-okhovat-400"><span>ورزش: {g.sport_hours} ساعت</span><span>مطالعه: {g.study_pages} صفحه</span></div>
                        </div>
                      ))}</div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => loadMemberPosts('workgroup_meeting')} className="card p-3 text-sm text-okhovat-700 dark:text-okhovat-200 hover:border-okhovat-300 transition flex items-center gap-2">
                      <Users size={16} className="text-okhovat-500" /> جلسات کارگروه
                    </button>
                    <button type="button" onClick={() => loadMemberPosts('circle_program')} className="card p-3 text-sm text-okhovat-700 dark:text-okhovat-200 hover:border-okhovat-300 transition flex items-center gap-2">
                      <Calendar size={16} className="text-okhovat-500" /> برنامه حلقه
                    </button>
                  </div>

                  {postPanel && (
                    <div className="card p-4">
                      <h3 className="text-sm font-semibold text-okhovat-800 dark:text-okhovat-100 mb-2">{postPanel === 'workgroup' ? 'جلسات کارگروه عضو' : 'برنامه حلقه عضو'}</h3>
                      {loadingPosts ? <Loader2 className="animate-spin text-okhovat-500 mx-auto my-4" size={20} /> : memberPosts.length === 0 ? <p className="text-sm text-okhovat-400">موردی ثبت نشده</p> : (
                        <div className="space-y-2">{memberPosts.slice(0, 10).map((p: any) => (
                          <div key={p.id} className="text-xs p-2 rounded-lg bg-okhovat-50 dark:bg-okhovat-900">
                            <p className="font-medium text-okhovat-800 dark:text-okhovat-100">{p.title || 'بدون عنوان'}</p>
                            <p className="text-okhovat-500 line-clamp-2 mt-0.5">{p.content}</p>
                          </div>
                        ))}</div>
                      )}
                    </div>
                  )}

                  <div className="card p-4">
                    <h3 className="text-sm font-semibold text-okhovat-800 dark:text-okhovat-100 mb-2 flex items-center gap-1.5"><MessageSquare size={14} /> پیام به عضو</h3>
                    <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="پیام تشویقی یا یادآوری..." rows={2} className="input-field resize-none mb-2" />
                    <button onClick={sendMessage} disabled={!messageText.trim() || sending} className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5 disabled:opacity-50">
                      {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} ارسال پیام
                    </button>
                    {messageSent && <p className="text-xs text-emerald-600 mt-2">پیام ذخیره شد و در پروفایل عضو نمایش داده می‌شود.</p>}
                    {messageError && <p className="text-xs text-red-500 mt-2">{messageError}</p>}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {tab === 'collective' && (
            <motion.div key="collective" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[{ id: 'sport', label: 'ورزش', icon: <Dumbbell size={14} /> }, { id: 'study', label: 'مطالعه', icon: <BookOpen size={14} /> }, { id: 'attendance', label: 'حضور', icon: <Users size={14} /> }].map((f) => (
                  <button key={f.id} onClick={() => setSelectedField(f.id as any)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedField === f.id ? 'bg-okhovat-500 text-white' : 'bg-white dark:bg-okhovat-900 text-okhovat-600 dark:text-okhovat-300 border border-okhovat-200 dark:border-okhovat-700'}`}>{f.icon} {f.label}</button>
                ))}
              </div>
              {loadingRank ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-okhovat-500" size={24} /></div> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="card p-4"><h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-3">۱۰ نفر اول</h3>{ranking.top.length === 0 ? <p className="text-xs text-okhovat-400">داده‌ای نیست</p> : <ol className="space-y-2">{ranking.top.map((u, i) => <li key={u.id} className="flex justify-between text-sm"><span>{i + 1}. {u.full_name}</span><span className="text-xs text-okhovat-500">{u.value} {u.unit}</span></li>)}</ol>}</div>
                  <div className="card p-4"><h3 className="text-sm font-semibold text-rose-700 dark:text-rose-300 mb-3">۱۰ نفر آخر</h3>{ranking.bottom.length === 0 ? <p className="text-xs text-okhovat-400">داده‌ای نیست</p> : <ol className="space-y-2">{ranking.bottom.map((u, i) => <li key={u.id} className="flex justify-between text-sm"><span>{i + 1}. {u.full_name}</span><span className="text-xs text-okhovat-500">{u.value} {u.unit}</span></li>)}</ol>}</div>
                </div>
              )}
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-okhovat-800 dark:text-okhovat-100 mb-3 flex items-center gap-1.5"><Star size={14} className="text-gold-500" /> امتیازدهی حلقه و کارگروه</h3>
                <div className="flex gap-2 mb-3">
                  <button type="button" onClick={() => { setScoreTarget('ring'); setScoreId('') }} className={`px-3 py-1.5 rounded-full text-xs font-medium ${scoreTarget === 'ring' ? 'bg-okhovat-500 text-white' : 'border border-okhovat-200 text-okhovat-600'}`}>حلقه</button>
                  <button type="button" onClick={() => { setScoreTarget('workgroup'); setScoreId('') }} className={`px-3 py-1.5 rounded-full text-xs font-medium ${scoreTarget === 'workgroup' ? 'bg-okhovat-500 text-white' : 'border border-okhovat-200 text-okhovat-600'}`}>کارگروه</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select className="input-field text-sm" value={scoreId} onChange={(e) => setScoreId(e.target.value)}><option value="">انتخاب...</option>{(scoreTarget === 'ring' ? rings : workgroups).map((item: any) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
                  <select className="input-field text-sm" value={scoreValue} onChange={(e) => setScoreValue(e.target.value)}><option value="10">۹–۱۰ عالی</option><option value="8">۷–۸ خوب</option><option value="6">۵–۶ متوسط</option><option value="3">زیر ۵</option></select>
                  <button type="button" onClick={submitScore} disabled={scoreSaving} className="btn-primary text-sm py-2.5 disabled:opacity-50">{scoreSaving ? '...' : 'ثبت امتیاز'}</button>
                </div>
                {scoreMsg && <p className="text-xs text-okhovat-600 mt-2">{scoreMsg}</p>}
              </div>
            </motion.div>
          )}

          {tab === 'messages' && (
            <motion.div key="messages" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="card p-5">
                <h3 className="font-semibold text-okhovat-800 dark:text-okhovat-100 mb-3 flex items-center gap-2"><MessageSquare size={16} className="text-okhovat-500" /> آرشیو پیام‌های ارسالی</h3>
                {loadingArchive ? <div className="flex justify-center py-8"><Loader2 className="animate-spin text-okhovat-500" size={22} /></div> : archive.length === 0 ? <p className="text-sm text-okhovat-400 py-6 text-center">هنوز پیامی ارسال نکرده‌اید.</p> : (
                  <div className="space-y-3">{archive.map((m) => (
                    <div key={m.id} className="p-3 rounded-xl bg-okhovat-50 dark:bg-okhovat-900 border border-okhovat-100 dark:border-okhovat-800">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-medium">به {m.recipient?.full_name || 'عضو'}</span>
                        <span className="text-[11px] text-okhovat-400">{m.created_at ? timeAgo(m.created_at) : ''}{m.is_read ? ' · خوانده‌شده' : ' · نخوانده'}</span>
                      </div>
                      <p className="text-sm text-okhovat-600 dark:text-okhovat-300 whitespace-pre-wrap">{m.body}</p>
                    </div>
                  ))}</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  )
}
