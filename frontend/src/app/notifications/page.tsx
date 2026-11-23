'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import { Bell, Loader2, CheckCheck } from 'lucide-react'
import { getNotifications, markNotificationRead } from '@/lib/api'

function timeAgo(dateStr: string) {
  const d = new Date(dateStr)
  const diff = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diff < 60) return 'همین الان'
  if (diff < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`
  return `${Math.floor(diff / 86400)} روز پیش`
}

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getNotifications()
      setItems(data.results || data || [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const markAll = async () => {
    await markNotificationRead()
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  const markOne = async (id: number) => {
    await markNotificationRead(id)
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-okhovat-800 dark:text-okhovat-100 flex items-center gap-2">
            <Bell className="text-okhovat-500" size={22} />
            اعلان‌ها
          </h1>
          <button
            type="button"
            onClick={markAll}
            className="text-xs flex items-center gap-1 text-okhovat-600 hover:underline"
          >
            <CheckCheck size={14} /> همه خوانده شد
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-okhovat-500" size={28} />
          </div>
        ) : items.length === 0 ? (
          <div className="card p-8 text-center text-okhovat-400 text-sm">اعلانی نیست</div>
        ) : (
          <div className="space-y-2">
            {items.map((n) => (
              <div
                key={n.id}
                className={`card p-4 ${!n.is_read ? 'ring-1 ring-okhovat-300 dark:ring-okhovat-600' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-okhovat-800 dark:text-okhovat-100">{n.title}</p>
                    {n.body && (
                      <p className="text-sm text-okhovat-600 dark:text-okhovat-300 mt-1">{n.body}</p>
                    )}
                    <p className="text-[11px] text-okhovat-400 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {!n.is_read && (
                      <button
                        type="button"
                        onClick={() => markOne(n.id)}
                        className="text-[11px] text-okhovat-500 hover:underline"
                      >
                        خواندم
                      </button>
                    )}
                    {n.link && (
                      <Link href={n.link} className="text-[11px] text-okhovat-600 hover:underline">
                        مشاهده
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
