'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, FileText, PlusCircle, TrendingUp, User,
  LayoutDashboard, Sparkles, Trophy
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import clsx from 'clsx'

interface SidebarProps {
  role?: 'member' | 'coach' | 'admin'
  onLoginClick?: () => void
  userName?: string
}

const memberLinks = [
  { href: '/', icon: Home, label: 'خانهٔ اخوت' },
  { href: '/posts', icon: FileText, label: 'پست‌ها' },
  { href: '/new-post', icon: PlusCircle, label: 'پست جدید' },
  { href: '/growth', icon: TrendingUp, label: 'رشد فردی' },
  { href: '/rankings', icon: Trophy, label: 'رتبه‌بندی حلقه‌ها' },
  { href: '/assistant', icon: Sparkles, label: 'همراه اخوت' },
  { href: '/profile', icon: User, label: 'پروفایل من' },
]

const coachLinks = [
  { href: '/', icon: Home, label: 'خانه' },
  { href: '/posts', icon: FileText, label: 'پست‌ها' },
  { href: '/coach', icon: LayoutDashboard, label: 'پنل نظارتی' },
  { href: '/rankings', icon: Trophy, label: 'رتبه‌بندی' },
  { href: '/assistant', icon: Sparkles, label: 'همراه اخوت' },
  { href: '/profile', icon: User, label: 'پروفایل' },
]

export default function Sidebar({ role = 'member', onLoginClick, userName }: SidebarProps) {
  const pathname = usePathname()
  const links = role === 'coach' || role === 'admin' ? coachLinks : memberLinks

  return (
    <aside className="hidden md:flex w-64 bg-white dark:bg-okhovat-950 border-l border-okhovat-100 dark:border-okhovat-800 flex-col fixed right-0 top-0 bottom-0 z-40">
      <div className="p-5 border-b border-okhovat-100 dark:border-okhovat-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-okhovat-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            ا
          </div>
          <div>
            <h1 className="font-bold text-okhovat-800 dark:text-okhovat-100 text-lg">اخوت</h1>
            <p className="text-xs text-okhovat-500 dark:text-okhovat-400">کنار هم، رو به رشد</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition',
                active
                  ? 'bg-okhovat-50 dark:bg-okhovat-900 text-okhovat-700 dark:text-okhovat-200'
                  : 'text-okhovat-700/70 dark:text-okhovat-300/70 hover:bg-okhovat-50/70 dark:hover:bg-okhovat-900/50'
              )}
            >
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-okhovat-100 dark:border-okhovat-800 space-y-3">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          {userName ? (
            <span className="text-xs text-okhovat-600 dark:text-okhovat-400 truncate max-w-[140px]">{userName}</span>
          ) : onLoginClick ? (
            <button
              onClick={onLoginClick}
              className="text-xs text-okhovat-600 dark:text-okhovat-400 hover:text-okhovat-500"
            >
              ورود
            </button>
          ) : (
            <Link
              href="/login"
              className="text-xs text-okhovat-600 dark:text-okhovat-400 hover:text-okhovat-500"
            >
              ورود
            </Link>
          )}
        </div>
        <div className="text-xs text-okhovat-500 dark:text-okhovat-500">
          <p>گروه اخوت</p>
          <p className="mt-0.5">۶۰ همراه، یک مسیر مشترک</p>
        </div>
      </div>
    </aside>
  )
}
