'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Home, FileText, PlusCircle, TrendingUp, User,
  Heart, MessageCircle, Repeat2, Share, MoreHorizontal,
  Sparkles, Image as ImageIcon, Smile
} from 'lucide-react'

const samplePosts = [
  {
    id: 1,
    user: { name: 'محمد رضایی', handle: '@mohammad_r', avatar: 'مر', role: 'سر حلقه' },
    content: 'یک عصر خوب، کنار رفقا\nاین هفته دور هم جمع شدیم، کتاب خواندیم و از برنامه‌های هفته بعد گفتیم. قشنگ‌ترین بخشش، شنیدن حرف‌های هم بود. 🌟',
    time: '۲ ساعت',
    likes: 12,
    comments: 4,
    reposts: 2,
    isCoach: false,
    hashtags: ['#رفاقت', '#حلقه_سلمان'],
    attendees: ['علی محمدی', 'حسین احمدی', 'مهدی کریمی']
  },
  {
    id: 2,
    user: { name: 'مربی احمدی', handle: '@coach_ahmadi', avatar: 'م', role: 'مربی' },
    content: 'سلام به همه اعضای عزیز اخوت. این هفته روی موضوع «مسئولیت‌پذیری» تمرکز داریم. منتظر گزارش‌های رشد فردی شما هستم. 💪',
    time: '۵ ساعت',
    likes: 28,
    comments: 7,
    reposts: 5,
    isCoach: true,
    hashtags: ['#پیام_مربی'],
    attendees: []
  },
  {
    id: 3,
    user: { name: 'علی محمدی', handle: '@ali_m', avatar: 'عم', role: 'عضو' },
    content: 'سلام دوستان امروز ۱.۵ ساعت ورزش کردم و ۲۰ صفحه مطالعه داشتم. مسئولیت گروهی هم انجام شد. روز خوبی بود ✨',
    time: '۸ ساعت',
    likes: 8,
    comments: 2,
    reposts: 0,
    isCoach: false,
    hashtags: ['#رشد_فردی'],
    attendees: []
  },
  {
    id: 4,
    user: { name: 'حسین کاظمی', handle: '@hosein_k', avatar: 'حک', role: 'مسئول کارگروه' },
    content: 'جلسه کارگروه آموزش امروز برگزار شد.\nموضوع: برنامه‌ریزی ماه آینده\nحاضرین مشخص شدن و مصوبات ثبت شد.',
    time: '۱ روز',
    likes: 15,
    comments: 6,
    reposts: 3,
    isCoach: false,
    hashtags: ['#کارگروه_آموزش'],
    attendees: ['سجاد', 'رضا', 'امیر']
  },
]

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState('برای شما')

  return (
    <div className="min-h-screen bg-white flex">
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

      {/* Main Feed - Twitter style */}
      <main className="flex-1 mr-64 border-x border-slate-200 min-h-screen max-w-2xl">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200">
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold text-slate-900">پست‌ها</h1>
          </div>

          {/* Tabs - Twitter style */}
          <div className="flex">
            {['برای شما', 'دنبال‌شده', 'ترندها'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3.5 text-sm font-medium relative transition ${
                  activeTab === tab
                    ? 'text-slate-900'
                    : 'text-slate-500 hover:bg-slate-50'
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

        {/* Compose box */}
        <div className="px-4 py-3 border-b border-slate-100 flex gap-3">
          <div className="w-10 h-10 rounded-full bg-okhovat-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            عم
          </div>
          <div className="flex-1">
            <Link href="/new-post" className="block text-slate-500 text-[17px] py-2 hover:text-slate-700">
              چه خبر از اخوت؟
            </Link>
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-1">
                <button className="p-2 rounded-full text-okhovat-600 hover:bg-okhovat-50 transition">
                  <ImageIcon size={18} />
                </button>
                <button className="p-2 rounded-full text-okhovat-600 hover:bg-okhovat-50 transition">
                  <Smile size={18} />
                </button>
              </div>
              <Link
                href="/new-post"
                className="bg-okhovat-600 hover:bg-okhovat-700 text-white text-sm font-bold px-4 py-1.5 rounded-full transition"
              >
                پست
              </Link>
            </div>
          </div>
        </div>

        {/* Trending banner */}
        {activeTab === 'ترندها' && (
          <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            <p className="text-sm text-amber-800">پست‌هایی که برای دیدن مربی پیشنهاد شدن</p>
          </div>
        )}

        {/* Posts */}
        <div>
          {samplePosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50/50 transition cursor-pointer ${\n                post.isCoach ? 'bg-amber-50/30' : ''
              }`}
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${\n                  post.isCoach ? 'bg-amber-500' : 'bg-okhovat-600'
                }`}>
                  {post.user.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-slate-900 text-[15px]">{post.user.name}</span>
                    {post.isCoach && (
                      <span className="text-[11px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">مربی</span>
                    )}
                    <span className="text-slate-500 text-[15px]">{post.user.handle}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 text-[15px]">{post.time}</span>
                    <button className="mr-auto text-slate-400 hover:text-okhovat-600 p-1 rounded-full hover:bg-okhovat-50">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>

                  {/* Content */}
                  <p className="text-slate-900 text-[15px] leading-relaxed mt-0.5 whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Hashtags */}
                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {post.hashtags.map(tag => (
                        <span key={tag} className="text-okhovat-600 text-[15px] hover:underline">{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Attendees */}
                  {post.attendees.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {post.attendees.map(name => (
                        <span key={name} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions - Twitter style */}
                  <div className="flex items-center justify-between mt-3 max-w-md">
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-sky-500 group">
                      <span className="p-1.5 rounded-full group-hover:bg-sky-50 transition">
                        <MessageCircle size={18} />
                      </span>
                      <span className="text-xs">{post.comments || ''}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-green-500 group">
                      <span className="p-1.5 rounded-full group-hover:bg-green-50 transition">
                        <Repeat2 size={18} />
                      </span>
                      <span className="text-xs">{post.reposts || ''}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-pink-500 group">
                      <span className="p-1.5 rounded-full group-hover:bg-pink-50 transition">
                        <Heart size={18} />
                      </span>
                      <span className="text-xs">{post.likes || ''}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-okhovat-600 group">
                      <span className="p-1.5 rounded-full group-hover:bg-okhovat-50 transition">
                        <Share size={18} />
                      </span>
                    </button>
                  </div>

                  {/* Suggest to coach */}
                  {!post.isCoach && (
                    <button className="mt-2 text-xs text-okhovat-600 hover:underline font-medium">
                      پیشنهاد برای دیدن مربی
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      {/* Left empty space for balance */}
      <div className="flex-1 hidden lg:block"></div>
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
