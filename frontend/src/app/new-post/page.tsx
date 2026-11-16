'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Home, FileText, PlusCircle, TrendingUp, User,
  ImagePlus, X, Users, MapPin, Calendar, Loader2
} from 'lucide-react'
import { createPost, getUser } from '@/lib/api'

const roles = [
  { id: 'normal', label: 'عضو عادی', postType: 'normal' },
  { id: 'ring_leader', label: 'سر حلقه', postType: 'circle_program' },
  { id: 'workgroup_leader', label: 'مسئول کارگروه', postType: 'workgroup_meeting' },
  { id: 'coach', label: 'مربی', postType: 'coach' },
]

export default function NewPostPage() {
  const router = useRouter()
  const user = getUser()
  const [role, setRole] = useState('normal')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const selectedRole = roles.find(r => r.id === role)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      setError('متن پست الزامی است')
      return
    }
    setError('')
    setLoading(true)

    try {
      let finalContent = content
      if (location) {
        finalContent += `\n\n📍 محل: ${location}`
      }

      await createPost({
        title: title || undefined,
        content: finalContent,
        post_type: selectedRole?.postType || 'normal',
      })

      setSuccess(true)
      setTimeout(() => {
        router.push('/posts')
      }, 1000)
    } catch (err: any) {
      setError(err.message || 'خطا در انتشار. ابتدا وارد شوید.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-l border-slate-200 flex flex-col fixed right-0 top-0 bottom-0 z-40">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-okhovat-600 flex items-center justify-center text-white font-bold text-lg">ا</div>
            <div>
              <h1 className="font-bold text-okhovat-800 text-lg">اخوت</h1>
              <p className="text-xs text-slate-500">کنار هم، رو به رشد</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavItem href="/" icon={<Home size={20} />} label="خانهٔ اخوت" />
          <NavItem href="/posts" icon={<FileText size={20} />} label="پست‌ها" />
          <NavItem href="/new-post" icon={<PlusCircle size={20} />} label="پست جدید" active />
          <NavItem href="/growth" icon={<TrendingUp size={20} />} label="رشد فردی" />
          <NavItem href="/profile" icon={<User size={20} />} label="پروفایل من" />
        </nav>
        <div className="p-4 border-t border-slate-100 text-xs text-slate-500">
          <p>گروه اخوت</p>
          <p className="mt-1">۶۰ همراه، یک مسیر مشترک</p>
        </div>
      </aside>

      <main className="flex-1 mr-64">
        <div className="max-w-2xl mx-auto py-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100">
              <h1 className="text-xl font-bold text-slate-800">یک روایت تازه</h1>
              <p className="text-sm text-slate-500 mt-1">اتفاق‌های خوب، با به اشتراک گذاشتن بیشتر می‌شوند.</p>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
              <span className="text-sm text-slate-600">نوع پست:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-okhovat-500"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-okhovat-600 flex items-center justify-center text-white font-bold">
                  {user?.full_name?.[0] || '?'}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{user?.full_name || 'کاربر'}</p>
                  <p className="text-xs text-slate-500">انتشار برای همه اعضای اخوت</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">عنوان (اختیاری)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="این روایت درباره چیست؟"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">متن روایت</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="از اتفاق امروز بگو... می‌توانی #هشتگ هم اضافه کنی."
                  rows={5}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {(role === 'ring_leader' || role === 'workgroup_leader') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 p-4 bg-okhovat-50 rounded-xl border border-okhovat-100"
                >
                  <h3 className="font-semibold text-okhovat-800 text-sm">
                    {role === 'ring_leader' ? 'برنامه حلقه' : 'ثبت جلسه کارگروه'}
                  </h3>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1 flex items-center gap-1">
                      <MapPin size={14} /> محل برگزاری
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="مثلاً: سالن اجتماعات"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500"
                    />
                  </div>
                </motion.div>
              )}

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-okhovat-400 transition cursor-pointer">
                <ImagePlus className="mx-auto text-slate-400 mb-2" size={32} />
                <p className="text-sm text-slate-600">عکس، ویدیو یا فایل (به‌زودی)</p>
                <p className="text-xs text-slate-400 mt-1">حداکثر ۱۰ مگابایت</p>
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              {success && <p className="text-sm text-emerald-600 text-center">منتشر شد! در حال انتقال...</p>}

              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-okhovat-600 hover:bg-okhovat-700 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'انتشار روایت'}
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
        active ? 'bg-okhovat-50 text-okhovat-700' : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}
