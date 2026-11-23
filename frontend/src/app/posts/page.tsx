'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import {
  Heart, MessageCircle, Share2, Bookmark,
  Sparkles, Loader2,
  PlusCircle, Film, Star, Send, X, UserPlus, UserCheck
} from 'lucide-react'
import {
  getPosts, toggleLike, toggleRecommend, toggleBookmark,
  getComments, addComment, toggleFollow, getUser,
} from '@/lib/api'

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
  const [openComments, setOpenComments] = useState<number | null>(null)
  const [comments, setComments] = useState<Record<number, any[]>>({})
  const [commentText, setCommentText] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const [sendingComment, setSendingComment] = useState(false)
  const [toast, setToast] = useState('')
  const me = typeof window !== 'undefined' ? getUser() : null

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const loadPosts = async () => {
    setLoading(true)
    setError('')
    try {
      const params: any = {}
      if (activeTab === 'پست‌های ترند شده') params.trending = true
      if (activeTab === 'دنبال‌شده‌ها') params.following = true
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
      showToast('برای لایک وارد شوید')
    }
  }

  const handleRecommend = async (postId: number) => {
    try {
      const res = await toggleRecommend(postId)
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                is_recommended: res.recommended,
                recommendation_count: res.recommendation_count,
                is_trending: res.recommended ? true : p.is_trending,
              }
            : p
        )
      )
      showToast(res.recommended ? 'پیشنهاد شد برای مربی' : 'پیشنهاد برداشته شد')
    } catch {
      showToast('برای پیشنهاد وارد شوید')
    }
  }

  const handleBookmark = async (postId: number) => {
    try {
      const res = await toggleBookmark(postId)
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, is_bookmarked: res.bookmarked } : p
        )
      )
      showToast(res.bookmarked ? 'ذخیره شد' : 'از ذخیره‌ها حذف شد')
    } catch {
      showToast('برای ذخیره وارد شوید')
    }
  }

  const handleFollow = async (userId: number) => {
    try {
      const res = await toggleFollow(userId)
      setPosts((prev) =>
        prev.map((p) =>
          p.user?.id === userId
            ? { ...p, user: { ...p.user, is_following: res.following } }
            : p
        )
      )
      showToast(res.following ? 'دنبال شد' : 'لغو دنبال')
    } catch {
      showToast('برای دنبال کردن وارد شوید')
    }
  }

  const handleShare = async (postId: number) => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/posts#${postId}`
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        showToast('لینک کپی شد')
      } else {
        showToast(url)
      }
    } catch {
      showToast('کپی لینک ممکن نشد')
    }
  }

  const openCommentBox = async (postId: number) => {
    if (openComments === postId) {
      setOpenComments(null)
      return
    }
    setOpenComments(postId)
    setCommentText('')
    setLoadingComments(true)
    try {
      const data = await getComments(postId)
      const list = data.results || data || []
      setComments((prev) => ({ ...prev, [postId]: Array.isArray(list) ? list : [] }))
    } catch {
      setComments((prev) => ({ ...prev, [postId]: [] }))
    } finally {
      setLoadingComments(false)
    }
  }

  const submitComment = async (postId: number) => {
    if (!commentText.trim()) return
    setSendingComment(true)
    try {
      const created = await addComment(postId, commentText.trim())
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), created],
      }))
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, comment_count: (p.comment_count || 0) + 1 }
            : p
        )
      )
      setCommentText('')
    } catch {
      showToast('برای نظر دادن وارد شوید')
    } finally {
      setSendingComment(false)
    }
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto relative">
        {toast && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-okhovat-800 text-white text-sm shadow-lg">
            {toast}
          </div>
        )}

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
            <p className="text-sm text-amber-800 dark:text-amber-200">پست‌های ترند یا پیشنهادی به مربی</p>
          </div>
        )}

        {activeTab === 'دنبال‌شده‌ها' && (
          <div className="px-4 py-2.5 text-xs text-okhovat-500 border-b border-okhovat-100 dark:border-okhovat-800">
            فقط پست‌های کسانی که دنبال می‌کنی
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
          <div className="text-center py-16 text-okhovat-400 text-sm">
            {activeTab === 'دنبال‌شده‌ها'
              ? 'هنوز کسی را دنبال نکرده‌ای یا پستی ندارند.'
              : 'هنوز پستی منتشر نشده'}
          </div>
        ) : (
          <div>
            {posts.map((post: any, index: number) => {
              const isCoach = post.post_type === 'coach' || post.user?.is_coach
              const name = post.user?.full_name || 'کاربر'
              const initial = name[0] || '?'
              const canFollow = post.user?.id && me?.id && post.user.id !== me.id
              return (
                <motion.article
                  key={post.id}
                  id={String(post.id)}
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
                        {canFollow && (
                          <button
                            type="button"
                            onClick={() => handleFollow(post.user.id)}
                            className={`text-[11px] px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                              post.user?.is_following
                                ? 'border-okhovat-300 text-okhovat-600 bg-okhovat-50 dark:bg-okhovat-900'
                                : 'border-okhovat-500 text-okhovat-600 hover:bg-okhovat-50'
                            }`}
                          >
                            {post.user?.is_following ? (
                              <><UserCheck size={12} /> دنبال می‌کنی</>
                            ) : (
                              <><UserPlus size={12} /> دنبال</>
                            )}
                          </button>
                        )}
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

                      <div className="flex items-center justify-between mt-3 max-w-md">
                        <button
                          onClick={() => openCommentBox(post.id)}
                          className="flex items-center gap-1.5 text-okhovat-500 hover:text-sky-500 group"
                        >
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
                          <button
                            onClick={() => handleRecommend(post.id)}
                            className={`flex items-center gap-1.5 group ${
                              post.is_recommended
                                ? 'text-gold-500'
                                : 'text-okhovat-500 hover:text-gold-500'
                            }`}
                            title="پیشنهاد به مربی"
                          >
                            <span className="p-1.5 rounded-full group-hover:bg-amber-50 dark:group-hover:bg-amber-950/30 transition">
                              <Star size={17} fill={post.is_recommended ? 'currentColor' : 'none'} />
                            </span>
                            <span className="text-xs">{post.recommendation_count || ''}</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleBookmark(post.id)}
                          className={`flex items-center gap-1.5 group ${
                            post.is_bookmarked
                              ? 'text-okhovat-600'
                              : 'text-okhovat-500 hover:text-okhovat-600'
                          }`}
                        >
                          <span className="p-1.5 rounded-full group-hover:bg-okhovat-50 dark:group-hover:bg-okhovat-900 transition">
                            <Bookmark size={17} fill={post.is_bookmarked ? 'currentColor' : 'none'} />
                          </span>
                        </button>
                        <button
                          onClick={() => handleShare(post.id)}
                          className="flex items-center gap-1.5 text-okhovat-500 hover:text-okhovat-600 group"
                        >
                          <span className="p-1.5 rounded-full group-hover:bg-okhovat-50 dark:group-hover:bg-okhovat-900 transition">
                            <Share2 size={17} />
                          </span>
                        </button>
                      </div>

                      {openComments === post.id && (
                        <div className="mt-3 pt-3 border-t border-okhovat-100 dark:border-okhovat-800">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-okhovat-600">نظرات</span>
                            <button onClick={() => setOpenComments(null)} className="text-okhovat-400">
                              <X size={14} />
                            </button>
                          </div>
                          {loadingComments ? (
                            <Loader2 className="animate-spin text-okhovat-400 mx-auto my-3" size={18} />
                          ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto mb-2">
                              {(comments[post.id] || []).length === 0 ? (
                                <p className="text-xs text-okhovat-400">هنوز نظری نیست.</p>
                              ) : (
                                (comments[post.id] || []).map((c) => (
                                  <div key={c.id} className="text-sm bg-okhovat-50 dark:bg-okhovat-900 rounded-xl px-3 py-2">
                                    <span className="font-medium text-okhovat-800 dark:text-okhovat-100 text-xs">
                                      {c.user?.full_name || 'کاربر'}
                                    </span>
                                    <p className="text-okhovat-600 dark:text-okhovat-300 text-sm mt-0.5">{c.content}</p>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <input
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                              placeholder="نظر خود را بنویس..."
                              className="input-field text-sm flex-1"
                            />
                            <button
                              onClick={() => submitComment(post.id)}
                              disabled={sendingComment || !commentText.trim()}
                              className="btn-primary px-3 py-2 disabled:opacity-50"
                            >
                              {sendingComment ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            </button>
                          </div>
                        </div>
                      )}
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
