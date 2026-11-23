'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AppShell from '@/components/AppShell'
import {
  ImagePlus, X, MapPin, Loader2, CheckCircle2
} from 'lucide-react'
import { createPost, getUser } from '@/lib/api'

const postTypes = [
  { id: 'normal', label: 'پست عادی', postType: 'normal' },
  { id: 'circle_program', label: 'برنامه حلقه', postType: 'circle_program' },
  { id: 'workgroup_meeting', label: 'جلسه کارگروه', postType: 'workgroup_meeting' },
  { id: 'coach', label: 'پست مربی', postType: 'coach' },
]

export default function NewPostPage() {
  const router = useRouter()
  const user = getUser()
  const fileRef = useRef<HTMLInputElement>(null)

  const [postType, setPostType] = useState('normal')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [location, setLocation] = useState('')
  const [media, setMedia] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const selected = postTypes.find((t) => t.id === postType)
  const needsLocation = postType === 'circle_program' || postType === 'workgroup_meeting'

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('حجم فایل نباید بیشتر از ۱۰ مگابایت باشد')
      return
    }
    setMedia(file)
    setPreview(URL.createObjectURL(file))
    setError('')
  }

  const removeMedia = () => {
    setMedia(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      setError('متن پست الزامی است')
      return
    }
    setError('')
    setLoading(true)

    try {
      let finalContent = content.trim()
      if (location.trim()) {
        finalContent += `\n\n📍 محل: ${location.trim()}`
      }

      await createPost({
        title: title.trim() || undefined,
        content: finalContent,
        post_type: selected?.postType || 'normal',
        media: media || undefined,
      })

      setSuccess(true)
      setTimeout(() => router.push('/posts'), 900)
    } catch (err: any) {
      setError(err.message || 'خطا در انتشار. ابتدا وارد شوید.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-5">
            <h1 className="text-xl font-bold text-okhovat-800 dark:text-okhovat-100">پست جدید</h1>
            <p className="text-sm text-okhovat-500 dark:text-okhovat-400 mt-1">
              اتفاق‌های خوب، با به اشتراک گذاشتن بیشتر می‌شوند.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card overflow-hidden">
            {/* Author */}
            <div className="p-5 border-b border-okhovat-100 dark:border-okhovat-800 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-okhovat-500 flex items-center justify-center text-white font-bold shrink-0">
                {user?.full_name?.[0] || '?'}
              </div>
              <div>
                <p className="font-semibold text-okhovat-800 dark:text-okhovat-100 text-sm">
                  {user?.full_name || 'کاربر'}
                </p>
                <p className="text-xs text-okhovat-500">انتشار برای همه اعضای اخوت</p>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Post type */}
              <div>
                <label className="block text-sm font-medium text-okhovat-700 dark:text-okhovat-200 mb-2">
                  نوع پست
                </label>
                <div className="flex flex-wrap gap-2">
                  {postTypes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPostType(t.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        postType === t.id
                          ? 'bg-okhovat-500 text-white border-okhovat-500'
                          : 'bg-white dark:bg-okhovat-900 text-okhovat-600 dark:text-okhovat-300 border-okhovat-200 dark:border-okhovat-700 hover:border-okhovat-400'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-okhovat-700 dark:text-okhovat-200 mb-1.5">
                  عنوان <span className="text-okhovat-400 font-normal">(اختیاری)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="این روایت درباره چیست؟"
                  className="input-field"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-okhovat-700 dark:text-okhovat-200 mb-1.5">
                  متن روایت
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="از اتفاق امروز بگو... می‌توانی #هشتگ هم اضافه کنی."
                  rows={5}
                  className="input-field resize-none"
                  required
                />
              </div>

              {/* Location for ring/workgroup */}
              {needsLocation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-xl bg-okhovat-50 dark:bg-okhovat-900 border border-okhovat-100 dark:border-okhovat-800 space-y-2"
                >
                  <h3 className="font-semibold text-okhovat-800 dark:text-okhovat-100 text-sm">
                    {postType === 'circle_program' ? 'برنامه حلقه' : 'ثبت جلسه کارگروه'}
                  </h3>
                  <label className="flex items-center gap-1.5 text-sm text-okhovat-600 dark:text-okhovat-300">
                    <MapPin size={14} /> محل برگزاری
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="مثلاً: سالن اجتماعات"
                    className="input-field"
                  />
                </motion.div>
              )}

              {/* Media */}
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={onFileChange}
                />
                {preview ? (
                  <div className="relative rounded-xl overflow-hidden border border-okhovat-100 dark:border-okhovat-800">
                    {media?.type.startsWith('video') ? (
                      <video src={preview} controls className="w-full max-h-64 object-cover" />
                    ) : (
                      <img src={preview} alt="پیش‌نمایش" className="w-full max-h-64 object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={removeMedia}
                      className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-okhovat-200 dark:border-okhovat-700 rounded-xl p-6 text-center hover:border-okhovat-400 dark:hover:border-okhovat-500 transition"
                  >
                    <ImagePlus className="mx-auto text-okhovat-400 mb-2" size={28} />
                    <p className="text-sm text-okhovat-600 dark:text-okhovat-300">عکس یا ویدیو پیوست کن</p>
                    <p className="text-xs text-okhovat-400 mt-1">حداکثر ۱۰ مگابایت</p>
                  </button>
                )}
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 px-4 py-3 text-sm text-red-600 dark:text-red-300 text-center">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300 text-center flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> منتشر شد! در حال انتقال...
                </div>
              )}

              <button
                type="submit"
                disabled={loading || success || !content.trim()}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    در حال انتشار...
                  </>
                ) : (
                  'انتشار روایت'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AppShell>
  )
}
