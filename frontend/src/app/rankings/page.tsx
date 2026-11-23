'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AppShell from '@/components/AppShell'
import { Trophy, Loader2, Users, Medal } from 'lucide-react'
import { getRings } from '@/lib/api'

export default function RankingsPage() {
  const [rings, setRings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getRings()
      .then((data) => setRings(data.results || data || []))
      .catch((err) => setError(err.message || 'خطا در دریافت'))
      .finally(() => setLoading(false))
  }, [])

  const sorted = [...rings].sort(
    (a, b) => (a.rank || 99) - (b.rank || 99) || (b.score || 0) - (a.score || 0)
  )

  const rankStyle = (index: number) => {
    if (index === 0) return 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
    if (index === 1) return 'bg-okhovat-100 dark:bg-okhovat-800 text-okhovat-700 dark:text-okhovat-200'
    if (index === 2) return 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300'
    return 'bg-okhovat-50 dark:bg-okhovat-900 text-okhovat-500'
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <h1 className="text-xl font-bold text-okhovat-800 dark:text-okhovat-100 flex items-center gap-2">
              <Trophy className="text-gold-500" size={24} />
              رتبه‌بندی حلقه‌ها
            </h1>
            <p className="text-sm text-okhovat-500 dark:text-okhovat-400 mt-1">
              امتیاز = (امتیاز مربی × ۲) + (درصد حضور × ۲) + لایک‌های خارج از حلقه
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-okhovat-500" size={28} />
            </div>
          ) : error ? (
            <div className="card p-8 text-center text-okhovat-500 text-sm">{error}</div>
          ) : sorted.length === 0 ? (
            <div className="card p-8 text-center text-okhovat-400 text-sm">هنوز حلقه‌ای ثبت نشده</div>
          ) : (
            <>
              {/* Top 3 highlight */}
              {sorted.length >= 1 && (
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[1, 0, 2].map((pos) => {
                    const ring = sorted[pos]
                    if (!ring) return <div key={pos} />
                    const isFirst = pos === 0
                    return (
                      <div
                        key={ring.id}
                        className={`card p-3 text-center ${
                          isFirst ? 'ring-2 ring-gold-500/40 order-first sm:order-none' : ''
                        } ${pos === 1 ? 'mt-4' : ''} ${pos === 2 ? 'mt-4' : ''}`}
                      >
                        <div className="flex justify-center mb-2">
                          <Medal
                            size={isFirst ? 28 : 22}
                            className={
                              pos === 0
                                ? 'text-gold-500'
                                : pos === 1
                                ? 'text-okhovat-400'
                                : 'text-orange-400'
                            }
                          />
                        </div>
                        <p className="text-sm font-bold text-okhovat-800 dark:text-okhovat-100 truncate">
                          {ring.name}
                        </p>
                        <p className="text-lg font-bold text-okhovat-600 dark:text-okhovat-300 mt-1">
                          {ring.score || 0}
                        </p>
                        <p className="text-[10px] text-okhovat-400">امتیاز</p>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Full table */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-okhovat-100 dark:border-okhovat-800">
                  <h2 className="font-semibold text-okhovat-800 dark:text-okhovat-100 text-sm">جدول کامل</h2>
                </div>
                <div className="divide-y divide-okhovat-50 dark:divide-okhovat-800">
                  {sorted.map((ring, index) => (
                    <motion.div
                      key={ring.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="px-4 sm:px-5 py-3.5 flex items-center gap-3 sm:gap-4"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          rankStyle(index)
                        }`}
                      >
                        {ring.rank || index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-okhovat-800 dark:text-okhovat-100 text-sm">
                          {ring.name}
                        </span>
                        <p className="text-xs text-okhovat-400 flex items-center gap-1 mt-0.5">
                          <Users size={12} /> {ring.members_count || 0} عضو
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-4 text-xs text-okhovat-500">
                        <span>حضور {ring.attendance_avg || 0}٪</span>
                        <span>مربی {ring.coach_score || 0}</span>
                        <span>{ring.external_likes || 0} لایک</span>
                      </div>
                      <div className="text-left shrink-0">
                        <p className="text-lg font-bold text-okhovat-600 dark:text-okhovat-300">
                          {ring.score || 0}
                        </p>
                        <p className="text-[10px] text-okhovat-400">امتیاز</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-5 card p-4 text-sm text-okhovat-600 dark:text-okhovat-300 space-y-1">
                <p className="font-medium text-okhovat-800 dark:text-okhovat-100 mb-2">نحوه محاسبه امتیاز:</p>
                <p>• امتیاز مربی × <strong>۲</strong></p>
                <p>• درصد حضور اعضای حلقه × <strong>۲</strong></p>
                <p>• هر لایک از افراد خارج از حلقه روی برنامه حلقه = +۱ امتیاز</p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AppShell>
  )
}
