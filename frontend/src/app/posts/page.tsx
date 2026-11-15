'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Home, FileText, PlusCircle, TrendingUp, User, 
  Heart, MessageCircle, Share2, MoreHorizontal,
  Sparkles
} from 'lucide-react'

// نمونه داده پست‌ها
const samplePosts = [
  {
    id: 1,
    user: { name: 'محمد رضایی', avatar: 'مر', role: 'سر حلقه' },
    content: 'یک عصر خوب، کنار رفقا\nاین هفته دور هم جمع شدیم، کتاب خواندیم و از برنامه‌های هفته بعد گفتیم. قشنگ‌ترین بخشش، شنیدن حرف‌های هم بود. 🌟 #رفاقت #حلقه_سلمان',
    time: '۲ ساعت پیش',
    likes: 12,
    comments: 4,
    isCoach: false,
    hashtags: ['#رفاقت', '#حلقه_سلمان'],
    attendees: ['علی محمدی', 'حسین احمدی', 'مهدی کریمی']
  },
  {
    id: 2,
    user: { name: 'مربی احمدی', avatar: 'م', role: 'مربی' },
    content: 'سلام به همه اعضای عزیز اخوت. این هفته روی موضوع «مسئولیت‌پذیری» تمرکز داریم. منتظر گزارش‌های رشد فردی شما هستم.',
    time: '۵ ساعت پیش',
    likes: 28,
    comments: 7,
    isCoach: true,
    hashtags: ['#پیام_مربی'],
    attendees: []
  },
  {
    id: 3,
    user: { name: 'علی محمدی', avatar: 'عم', role: 'عضو' },
    content: 'سلام دوستان امروز ۱.۵ ساعت ورزش کردم و ۲۰ صفحه مطالعه داشتم. مسئولیت گروهی هم انجام شد. 💪',
    time: 'دیروز',
    likes: 8,
    comments: 2,
    isCoach: false,
    hashtags: ['#رشد_فردی'],
    attendees: []
  },
]

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState('all')

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

      {/* Main Content */}
      <main className="flex-1 mr-64">
        <div className="max-w-2xl mx-auto py-6 px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-800">پست‌ها</h1>
            <Link 
              href="/new-post"
              className="bg-okhovat-600 hover:bg-okhovat-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition"
            >
              <PlusCircle size={18} />
              پست جدید
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['همه', 'برای شما', 'دنبال‌شده‌ها', 'پست‌های ترند شده'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeTab === tab
                    ? 'bg-okhovat-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Trending Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-l from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-4 mb-6 flex items-center gap-3"
          >
            <Sparkles className="text-amber-500" size={22} />
            <div>
              <p className="font-medium text-amber-900 text-sm">پست‌های ترند شده</p>
              <p className="text-xs text-amber-700">پست‌هایی که بچه‌ها برای دیدن مربی پیشنهاد دادن</p>
            </div>
          </motion.div>

          {/* Posts Feed */}
          <div className="space-y-5">
            {samplePosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
                  post.isCoach ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-100'
                }`}
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold ${
                      post.isCoach ? 'bg-amber-500' : 'bg-okhovat-600'
                    }`}>
                      {post.user.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{post.user.name}</span>
                        {post.isCoach && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">مربی</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{post.time} · {post.user.role}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="px-4 pb-3">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{post.content}</p>
                  
                  {post.attendees.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.attendees.map((name) => (
                        <span key={name} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-4 py-3 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition">
                      <Heart size={20} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-okhovat-600 transition">
                      <MessageCircle size={20} />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-okhovat-600 transition">
                      <Share2 size={20} />
                    </button>
                  </div>
                  <button className="text-xs text-okhovat-600 hover:text-okhovat-700 font-medium">
                    پیشنهاد به مربی
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
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
