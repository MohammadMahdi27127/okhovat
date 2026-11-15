'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Home, FileText, PlusCircle, TrendingUp, User,
  ImagePlus, X, Users, MapPin, Calendar
} from 'lucide-react'

const roles = [
  { id: 'normal', label: 'عضو عادی' },
  { id: 'ring_leader', label: 'سر حلقه' },
  { id: 'workgroup_leader', label: 'مسئول کارگروه' },
  { id: 'coach', label: 'مربی' },
]

const sampleMembers = [
  'علی محمدی', 'حسین احمدی', 'مهدی کریمی', 'رضا موسوی', 
  'سجاد کاظمی', 'محمد طاهری', 'امیر حسینی'
]

export default function NewPostPage() {
  const [role, setRole] = useState('normal')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [showMembers, setShowMembers] = useState(false)

  const toggleMember = (name: string) => {
    setSelectedMembers(prev => 
      prev.includes(name) 
        ? prev.filter(m => m !== name)
        : [...prev, name]
    )
  }

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
          <NavItem href="/new-post" icon={<PlusCircle size={20} />} label="پست جدید" active />
          <NavItem href="/growth" icon={<TrendingUp size={20} />} label="رشد فردی" />
          <NavItem href="/profile" icon={<User size={20} />} label="پروفایل من" />
        </nav>

        <div className="p-4 border-t border-slate-100 text-xs text-slate-500">
          <p>گروه اخوت</p>
          <p className="mt-1">۶۰ همراه، یک مسیر مشترک</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-64">
        <div className="max-w-2xl mx-auto py-6 px-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100">
              <h1 className="text-xl font-bold text-slate-800">یک روایت تازه</h1>
              <p className="text-sm text-slate-500 mt-1">اتفاق‌های خوب، با به اشتراک گذاشتن بیشتر می‌شوند.</p>
            </div>

            {/* Role Preview */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
              <span className="text-sm text-slate-600">مشاهده از نگاه:</span>
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

            <div className="p-5 space-y-5">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-okhovat-600 flex items-center justify-center text-white font-bold">
                  عم
                </div>
                <div>
                  <p className="font-semibold text-slate-800">علی محمدی</p>
                  <p className="text-xs text-slate-500">انتشار برای همه اعضای اخوت</p>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">عنوان روایت</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="این روایت درباره چیست؟"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500 focus:border-transparent"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">متن روایت</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="از اتفاق امروز بگو... می‌توانی #هشتگ هم اضافه کنی."
                  rows={5}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Role-based extra fields */}
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

                  <div>
                    <label className="block text-sm text-slate-600 mb-1 flex items-center gap-1">
                      <Users size={14} /> افراد حاضر
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowMembers(!showMembers)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-right bg-white hover:bg-slate-50 transition"
                    >
                      {selectedMembers.length > 0 
                        ? `${selectedMembers.length} نفر انتخاب شده` 
                        : 'انتخاب افراد...'}
                    </button>

                    {showMembers && (
                      <div className="mt-2 p-3 bg-white border border-slate-200 rounded-lg max-h-40 overflow-y-auto space-y-1">
                        {sampleMembers.map(name => (
                          <label key={name} className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedMembers.includes(name)}
                              onChange={() => toggleMember(name)}
                              className="rounded text-okhovat-600 focus:ring-okhovat-500"
                            />
                            <span className="text-sm">{name}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {selectedMembers.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {selectedMembers.map(name => (
                          <span key={name} className="inline-flex items-center gap-1 text-xs bg-okhovat-100 text-okhovat-700 px-2.5 py-1 rounded-full">
                            {name}
                            <button onClick={() => toggleMember(name)}>
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {role === 'workgroup_leader' && (
                    <div>
                      <label className="block text-sm text-slate-600 mb-1 flex items-center gap-1">
                        <Calendar size={14} /> زمان برگزاری
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500"
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* Media Upload */}
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-okhovat-400 transition cursor-pointer">
                <ImagePlus className="mx-auto text-slate-400 mb-2" size={32} />
                <p className="text-sm text-slate-600">عکس، ویدیو یا فایل روایت</p>
                <p className="text-xs text-slate-400 mt-1">حداکثر ۱۰ مگابایت</p>
              </div>

              {/* Submit */}
              <button
                className="w-full bg-okhovat-600 hover:bg-okhovat-700 text-white font-medium py-3 rounded-xl transition"
              >
                انتشار روایت
              </button>

              <p className="text-xs text-center text-slate-400">
                انتشار در این نسخه فقط در همین مرورگر ذخیره می‌شود.
              </p>
            </div>
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
