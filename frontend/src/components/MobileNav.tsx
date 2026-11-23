'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, PlusCircle, TrendingUp, Film, LayoutDashboard, User, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

interface MobileNavProps {
  role?: 'member' | 'coach' | 'admin'
}

export default function MobileNav({ role = 'member' }: MobileNavProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Coach simple 4-item bar
  if (role === 'coach' || role === 'admin') {
    const coachItems = [
      { href: '/', icon: Home, label: 'خانه' },
      { href: '/posts', icon: FileText, label: 'پست‌ها' },
      { href: '/coach', icon: LayoutDashboard, label: 'پنل' },
      { href: '/profile', icon: User, label: 'پروفایل' },
    ]
    return (
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-okhovat-950/95 backdrop-blur border-t border-okhovat-100 dark:border-okhovat-800 safe-area-pb">
        <div className="flex items-center justify-around h-16 px-2">
          {coachItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition',
                  active ? 'text-okhovat-500' : 'text-okhovat-400 dark:text-okhovat-500'
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    )
  }

  // Member: Home + Posts on sides, Logo center opens shortcuts
  return (
    <>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 safe-area-pb">
        <div className="mx-3 mb-3 h-14 bg-white/95 dark:bg-okhovat-950/95 backdrop-blur rounded-full border border-okhovat-100 dark:border-okhovat-800 shadow-lg flex items-center justify-between px-6">
          <Link
            href="/"
            className={clsx(
              'flex flex-col items-center gap-0.5 transition',
              pathname === '/' ? 'text-okhovat-500' : 'text-okhovat-400'
            )}
          >
            <Home size={22} strokeWidth={pathname === '/' ? 2.2 : 1.8} />
            <span className="text-[10px] font-medium">خانه</span>
          </Link>

          {/* Center Logo button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="w-12 h-12 -mt-5 rounded-full bg-okhovat-500 text-white flex items-center justify-center shadow-md hover:bg-okhovat-600 transition active:scale-95"
            aria-label="میان‌برها"
          >
            <span className="text-xl font-bold">ا</span>
          </button>

          <Link
            href="/posts"
            className={clsx(
              'flex flex-col items-center gap-0.5 transition',
              pathname.startsWith('/posts') ? 'text-okhovat-500' : 'text-okhovat-400'
            )}
          >
            <FileText size={22} strokeWidth={pathname.startsWith('/posts') ? 2.2 : 1.8} />
            <span className="text-[10px] font-medium">پست‌ها</span>
          </Link>
        </div>
      </nav>

      {/* Shortcuts sheet */}
      <AnimatePresence>
        {menuOpen && (
          <div className="md:hidden fixed inset-0 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="absolute bottom-0 inset-x-0 bg-white dark:bg-okhovat-950 rounded-t-3xl p-5 pb-8"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-okhovat-800 dark:text-okhovat-100">میان‌برها</h3>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-okhovat-50 dark:bg-okhovat-900 flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Shortcut href="/new-post" icon={<PlusCircle size={22} />} label="پست جدید" onClick={() => setMenuOpen(false)} />
                <Shortcut href="/growth" icon={<TrendingUp size={22} />} label="رشد فردی" onClick={() => setMenuOpen(false)} />
                <Shortcut href="/reels" icon={<Film size={22} />} label="ریلز" onClick={() => setMenuOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

function Shortcut({
  href,
  icon,
  label,
  onClick,
}: {
  href: string
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-okhovat-50 dark:bg-okhovat-900 text-okhovat-700 dark:text-okhovat-200 hover:bg-okhovat-100 dark:hover:bg-okhovat-800 transition"
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </Link>
  )
}
