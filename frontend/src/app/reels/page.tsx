'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import { Film, PlusCircle, ArrowRight } from 'lucide-react'

export default function ReelsPage() {
  return (
    <AppShell>
      <div className="max-w-lg mx-auto px-4 py-16 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-okhovat-500 to-okhovat-700 flex items-center justify-center mb-6 shadow-lg">
            <Film size={36} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-okhovat-800 dark:text-okhovat-100 mb-2">
            ریلز اخوت
          </h1>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-medium mb-4">
            به‌زودی
          </div>

          <p className="text-okhovat-600 dark:text-okhovat-300 leading-relaxed mb-2">
            فضایی شبیه ریلز برای اشتراک لحظه‌های کوتاه گروه.
          </p>
          <p className="text-sm text-okhovat-400 dark:text-okhovat-500 mb-8">
            ویدیوهای کوتاه آموزشی، گزارش جلسات و لحظه‌های اخوت اینجا جمع می‌شوند.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/posts"
              className="inline-flex items-center gap-1.5 btn-primary px-5 py-2.5 text-sm"
            >
              رفتن به پست‌ها
              <ArrowRight size={16} className="rotate-180" />
            </Link>
            <Link
              href="/new-post"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm rounded-xl border border-okhovat-200 dark:border-okhovat-700 text-okhovat-600 dark:text-okhovat-300 hover:bg-okhovat-50 dark:hover:bg-okhovat-900 transition"
            >
              <PlusCircle size={16} />
              پست جدید
            </Link>
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}
