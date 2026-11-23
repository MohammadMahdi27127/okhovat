'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import {
  Heart, MessageCircle, Share2, Bookmark,
  Sparkles, Image as ImageIcon, Smile, Loader2,
  PlusCircle, Film, Star
} from 'lucide-react'
import { getPosts, toggleLike } from '@/lib/api'

function timeAgo(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return 'همین الان'
  if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت`
  return `${Math.floor(diff / 86400)} روز`
}

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState('برای شما')
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPosts = async () => {
    setLoading(true)
    setError('')
    try {
      const params: any = {}
      if (activeTab === 'پست‌های ترند شده') params.trending = true
      const data = await getPosts(params)
      setPosts(data.results || data || [])
    } catch (err: any) {
      setError(err.message || 'خطا در دریافت پست‌ها')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [activeTab])

  const handleLike = async (postId: number) => {
    try {
      const res = await toggleLike(postId)
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, like_count: res.like_count, is_liked: res.liked } : p
        )
      )
    } catch {
      // ignore if not logged in
    }
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        {/* Header actions */}
        <div className="sticky top-0 z-20 bg-cream-100/90 dark:bg-okhovat-950/90 backdrop-blur-md border-b border-okhovat-100 dark:border-okhovat-800 px-4 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-okhovat-800 dark:text-okhovat-100">پست‌ها</h1>
            <div className="flex gap-2">
              <Link
                href="/new-post"
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-okhovat-500 text-white hover:bg-okhovat-600 transition"
              >
                <PlusCircle size={14} /> پست جدید
              </Link>
              <Link
                href="/reels"
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-okhovat-200 dark:border-okhovat-700 text-okhovat-600 dark:text-okhovat-300 hover:bg-okhovat-50 dark:hover:bg-okhovat-900 transition"
              >
                <Film size={14} /> ریلز
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex">
            {['برای شما', 'دنبال‌شده‌ها', 'پست‌های ترند شده'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium relative transition ${
                  activeTab === tab
                    ? 'text-okhovat-800 dark:text-okhovat-100'
                    : 'text-okhovat-500 hover:text-okhovat-700 dark:hover:text-okhovat-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="posts-tab"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-10 bg-okhovat-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'پست‌های ترند شده' && (
          <div className="px-4 py-2.5 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/30 flex items-center gap-2">
            <Sparkles size={15} className="text-amber-500" />
            <p className="text-sm text-amber-800 dark:text-amber-200">پست‌هایی که برای دیدن مربی پیشنهاد شده‌اند</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-okhovat-500" size={28} />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-okhovat-500 text-sm">
            <p>{error}</p>
            <button onClick={loadPosts} className="mt-3 text-okhovat-600 hover:underline">تلاش مجدد</button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-okhovat-400 text-sm">هنوز پستی منتشر نشده</div>
        ) : (
          <div>
            {posts.map((post: any, index: number) => {
              const isCoach = post.post_type === 'coach' || post.user?.is_coach
              const name = post.user?.full_name || 'کاربر'
              const initial = name[0] || '?'
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className={`px-4 py-4 border-b border-okhovat-100 dark:border-okhovat-800 hover:bg-okhovat-50/40 dark:hover:bg-okhovat-900/30 transition ${
                    isCoach ? 'bg-amber-50/40 dark:bg-amber-950/15' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                        isCoach ? 'bg-gold-500' : 'bg-okhovat-500'
                      }`}
                    >
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-okhovat-800 dark:text-okhovat-100 text-[15px]">{name}</span>
                        {isCoach && (
                          <span className="text-[11px] bg-gold-500/15 text-gold-600 dark:text-gold-400 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                            <Star size={10} /> پست مربی
                          </span>
                        )}
                        <span className="text-okhovat-400">·</span>
                        <span className="text-okhovat-500 text-sm">{timeAgo(post.created_at)}</span>
                      </div>
                      {post.title && (
                        <p className="font-medium text-okhovat-800 dark:text-okhovat-100 text-[15px] mt-0.5">{post.title}</p>
                      )}
                      <p className="text-okhovat-700 dark:text-okhovat-200 text-[15px] leading-relaxed mt-0.5 whitespace-pre-line">
                        {post.content}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-3 max-w-md">
                        <button className="flex items-center gap-1.5 text-okhovat-500 hover:text-sky-500 group">
                          <span className="p-1.5 rounded-full group-hover:bg-sky-50 dark:group-hover:bg-sky-950/30 transition">
                            <MessageCircle size={17} />
                          </span>
                          <span className="text-xs">{post.comment_count || ''}</span>
                        </button>
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1.5 group ${
                            post.is_liked ? 'text-pink-500' : 'text-okhovat-500 hover:text-pink-500'
                          }`}
                        >
                          <span className="p-1.5 rounded-full group-hover:bg-pink-50 dark:group-hover:bg-pink-950/30 transition">
                            <Heart size={17} fill={post.is_liked ? 'currentColor' : 'none'} />
                          </span>
                          <span className="text-xs">{post.like_count || ''}</span>
                        </button>
                        {!isCoach && (
                          <button className="flex items-center gap-1.5 text-okhovat-500 hover:text-gold-500 group">
                            <span className="p-1.5 rounded-full group-hover:bg-amber-50 dark:group-hover:bg-amber-950/30 transition">
                              <Star size={17} />
                            </span>
                          </button>
                        )}
                        <button className="flex items-center gap-1.5 text-okhovat-500 hover:text-okhovat-600 group">
                          <span className="p-1.5 rounded-full group-hover:bg-okhovat-50 dark:group-hover:bg-okhovat-900 transition">
                            <Bookmark size={17} />
                          </span>
                        </button>
                        <button className="flex items-center gap-1.5 text-okhovat-500 hover:text-okhovat-600 group">
                          <span className="p-1.5 rounded-full group-hover:bg-okhovat-50 dark:group-hover:bg-okhovat-900 transition">
                            <Share2 size={17} />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
