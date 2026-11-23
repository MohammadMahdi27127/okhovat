'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import {
  Send, Trash2, User, Sparkles, Loader2
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

const SUGGESTIONS = [
  'چطور گزارش رشد ثبت کنم؟',
  'وضعیت حلقه‌ام چطوره؟',
  'برنامه این هفته چیه؟',
  'چطور به مربی پیام بدم؟',
  'پست جدید بگذارم؟',
]

function nowTime() {
  return new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
}

function generateReply(input: string): string {
  const q = input.trim().toLowerCase()

  if (q.includes('رشد') || q.includes('گزارش')) {
    return 'برای ثبت گزارش رشد روزانه برو به بخش «رشد فردی» از منو. آنجا می‌تونی ورزش، مطالعه، مهارت، مسئولیت گروهی و اوقات فراغت رو ثبت کنی. اگر بخوای، می‌تونی تیک انتشار خلاصه در پست‌ها رو هم بزنی.'
  }
  if (q.includes('حلقه') || q.includes('حضور')) {
    return 'وضعیت حضور و رتبه حلقه رو می‌تونی از صفحه پروفایل ببینی. بخش «حضور» درصد حضور خودت و میانگین حلقه رو نشون می‌ده. برای جزئیات بیشتر، مربی حلقه هم در پنل نظارتی دسترسی داره.'
  }
  if (q.includes('برنامه') || q.includes('هفته')) {
    return 'برنامه‌های هفته در صفحه خانه، بخش «برنامه‌های هفته» نمایش داده می‌شه. جلسات حلقه و کارگروه‌ها اونجا لیست می‌شن. اگر چیزی ندیدی، یعنی هنوز برنامه‌ای ثبت نشده.'
  }
  if (q.includes('مربی') || q.includes('پیام')) {
    return 'پیام‌های مربی در صفحه پروفایل، بخش «پیام‌های مربی» نشون داده می‌شه. مربی می‌تونه از پنل نظارتی برات پیام بفرسته. برای پیشنهاد پست به مربی هم از آیکون ستاره زیر هر پست استفاده کن.'
  }
  if (q.includes('پست')) {
    return 'برای نوشتن پست جدید از منو «پست جدید» رو باز کن یا در موبایل روی لوگوی اخوت بزن و میان‌بر پست جدید رو انتخاب کن. پست‌ها در فید «برای شما» و «دنبال‌شده‌ها» دیده می‌شن.'
  }
  if (q.includes('سلام') || q.includes('درود') || q.includes('هی')) {
    return 'سلام! من همراه اخوت هستم. هر سوالی درباره ثبت رشد، حلقه، برنامه‌ها، پست‌ها یا ارتباط با مربی داشتی بپرس.'
  }
  if (q.includes('ممنون') || q.includes('مرسی')) {
    return 'خواهش می‌کنم. هر وقت خواستی دوباره اینجام.'
  }

  return 'سوالت رو گرفتم. فعلاً می‌تونم درباره ثبت رشد، وضعیت حلقه، برنامه‌های هفته، پست‌ها و پیام مربی راهنمایی کنم. اگر موضوع دیگه‌ای مد نظرته، کمی واضح‌تر بگو تا بهتر کمکت کنم.'
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'سلام! من همراه اخوت هستم. هر سوالی درباره سامانه، رشد فردی، حلقه یا مربی داشتی بپرس.',
      time: nowTime(),
    },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        role: 'assistant',
        content: 'گفتگو پاک شد. دوباره بپرس؛ من اینجام.',
        time: nowTime(),
      },
    ])
  }

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || sending) return

    const userMsg: Message = {
      id: 'u-' + Date.now(),
      role: 'user',
      content,
      time: nowTime(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setSending(true)

    // Simulate thinking delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 500))

    const reply: Message = {
      id: 'a-' + Date.now(),
      role: 'assistant',
      content: generateReply(content),
      time: nowTime(),
    }
    setMessages((prev) => [...prev, reply])
    setSending(false)
    inputRef.current?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-5.5rem)] md:h-[calc(100vh-1.5rem)]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-okhovat-100 dark:border-okhovat-800 bg-cream-100/95 dark:bg-okhovat-950/95 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-okhovat-500 flex items-center justify-center text-white shadow-sm">
              <Sparkles size={18} />
            </div>
            <div>
              <h1 className="font-bold text-okhovat-800 dark:text-okhovat-100 text-base">همراه اخوت</h1>
              <p className="text-xs text-okhovat-500 dark:text-okhovat-400">همیشه در دسترس</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-okhovat-500 hover:bg-okhovat-50 dark:hover:bg-okhovat-900 transition"
              title="پاک کردن گفتگو"
              aria-label="پاک کردن گفتگو"
            >
              <Trash2 size={18} />
            </button>
            <Link
              href="/profile"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-okhovat-500 hover:bg-okhovat-50 dark:hover:bg-okhovat-900 transition"
              title="پروفایل"
            >
              <User size={18} />
            </Link>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-okhovat-500 text-white rounded-br-md'
                      : 'bg-white dark:bg-okhovat-900 text-okhovat-800 dark:text-okhovat-100 border border-okhovat-100 dark:border-okhovat-800 rounded-bl-md shadow-card'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1.5 ${
                      msg.role === 'user' ? 'text-white/60' : 'text-okhovat-400'
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {sending && (
            <div className="flex justify-end">
              <div className="bg-white dark:bg-okhovat-900 border border-okhovat-100 dark:border-okhovat-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-card">
                <Loader2 size={16} className="animate-spin text-okhovat-500" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && !sending && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-okhovat-200 dark:border-okhovat-700 text-okhovat-600 dark:text-okhovat-300 bg-white dark:bg-okhovat-900 hover:bg-okhovat-50 dark:hover:bg-okhovat-800 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-okhovat-100 dark:border-okhovat-800 bg-cream-100 dark:bg-okhovat-950">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="پیامت را بنویس..."
              rows={1}
              className="input-field resize-none max-h-28 min-h-[42px] py-2.5"
              style={{ height: 'auto' }}
              onInput={(e) => {
                const t = e.target as HTMLTextAreaElement
                t.style.height = 'auto'
                t.style.height = Math.min(t.scrollHeight, 112) + 'px'
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || sending}
              className="w-11 h-11 shrink-0 rounded-xl bg-okhovat-500 hover:bg-okhovat-600 disabled:opacity-50 text-white flex items-center justify-center transition"
              aria-label="ارسال"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-okhovat-400 mt-1.5 text-center">
            Enter برای ارسال · Shift+Enter خط جدید
          </p>
        </div>
      </div>
    </AppShell>
  )
}
