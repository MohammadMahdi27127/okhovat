'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Home, FileText, PlusCircle, TrendingUp, User,
  Heart, MessageCircle, Repeat2, Share, MoreHorizontal,
  Sparkles, Image as ImageIcon, Smile, Loader2
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
      if (activeTab === 'ترندها') params.trending = true
      const data = await getPosts(params)
      // DRF pagination: results or direct array
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
      setPosts(prev => prev.map(p =>
        p.id === postId
          ? { ...p, like_count: res.like_count, is_liked: res.liked }
          : p
      ))
    } catch {
      // ignore if not logged in
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
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
          <NavItem href="/posts" icon={<FileText size={20} />} label="پست‌ها" active />
          <NavItem href="/new-post" icon={<PlusCircle size={20} />} label="پست جدید" />
          <NavItem href="/growth" icon={<TrendingUp size={20} />} label="رشد فردی" />
          <NavItem href="/profile" icon={<User size={20} />} label="پروفایل من" />
        </nav>
        <div className="p-4 border-t border-slate-100 text-xs text-slate-500">
          <p>گروه اخوت</p>
          <p className="mt-1">۶۰ همراه، یک مسیر مشترک</p>
        </div>
      </aside>

      <main className="flex-1 mr-64 border-x border-slate-200 min-h-screen max-w-2xl">
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200">
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold text-slate-900">پست‌ها</h1>
          </div>
          <div className="flex">
            {['برای شما', 'دنبال‌شده', 'ترندها'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3.5 text-sm font-medium relative transition ${
                  activeTab === tab ? 'text-slate-900' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-okhovat-500 rounded-full mx-auto"
                    style={{ width: '40%' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-b border-slate-100 flex gap-3">
          <div className="w-10 h-10 rounded-full bg-okhovat-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">عم</div>
          <div className="flex-1">
            <Link href="/new-post" className="block text-slate-500 text-[17px] py-2 hover:text-slate-700">
              چه خبر از اخوت؟
            </Link>
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-1">
                <button className="p-2 rounded-full text-okhovat-600 hover:bg-okhovat-50 transition"><ImageIcon size={18} /></button>
                <button className="p-2 rounded-full text-okhovat-600 hover:bg-okhovat-50 transition"><Smile size={18} /></button>
              </div>
              <Link href="/new-post" className="bg-okhovat-600 hover:bg-okhovat-700 text-white text-sm font-bold px-4 py-1.5 rounded-full transition">
                پست
              </Link>
            </div>
          </div>
        </div>

        {activeTab === 'ترندها' && (
          <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            <p className="text-sm text-amber-800">پست‌هایی که برای دیدن مربی پیشنهاد شدن</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-okhovat-600" size={28} />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            <p>{error}</p>
            <button onClick={loadPosts} className="mt-3 text-okhovat-600 hover:underline">تلاش مجدد</button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">هنوز پستی منتشر نشده</div>
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
                  className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50/50 transition ${
                    isCoach ? 'bg-amber-50/30' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                      isCoach ? 'bg-amber-500' : 'bg-okhovat-600'
                    }`}>
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 text-[15px]">{name}</span>
                        {isCoach && (
                          <span className="text-[11px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">مربی</span>
                        )}
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500 text-[15px]">{timeAgo(post.created_at)}</span>
                      </div>
                      {post.title && (
                        <p className="font-medium text-slate-800 text-[15px] mt-0.5">{post.title}</p>
                      )}
                      <p className="text-slate-900 text-[15px] leading-relaxed mt-0.5 whitespace-pre-line">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between mt-3 max-w-md">
                        <button className="flex items-center gap-1.5 text-slate-500 hover:text-sky-500 group">
                          <span className="p-1.5 rounded-full group-hover:bg-sky-50 transition"><MessageCircle size={18} /></span>
                          <span className="text-xs">{post.comment_count || ''}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-slate-500 hover:text-green-500 group">
                          <span className="p-1.5 rounded-full group-hover:bg-green-50 transition"><Repeat2 size={18} /></span>
                        </button>
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1.5 group ${
                            post.is_liked ? 'text-pink-500' : 'text-slate-500 hover:text-pink-500'
                          }`}
                        >
                          <span className="p-1.5 rounded-full hover:bg-pink-50 transition">
                            <Heart size={18} fill={post.is_liked ? 'currentColor' : 'none'} />
                          </span>
                          <span className="text-xs">{post.like_count || ''}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-slate-500 hover:text-okhovat-600 group">
                          <span className="p-1.5 rounded-full group-hover:bg-okhovat-50 transition"><Share size={18} /></span>
                        </button>
                      </div>
                      {!isCoach && (
                        <button className="mt-2 text-xs text-okhovat-600 hover:underline font-medium">
                          پیشنهاد برای دیدن مربی
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </main>

      <div className="flex-1 hidden lg:block"></div>
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
