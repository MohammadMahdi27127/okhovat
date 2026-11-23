'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AppShell from '@/components/AppShell'
import {
  Camera, LogOut, BookOpen, Dumbbell, MessageSquare, Users
} from 'lucide-react'

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-bold text-okhovat-800 dark:text-okhovat-100">پروفایل</h1>
            <button className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 px-3 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition">
              <LogOut size={16} />
              خروج
            </button>
          </div>

          {/* Intro Card */}
          <div className="card p-5 mb-4">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-okhovat-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  عم
                </div>
                <button className="absolute -bottom-1 -left-1 w-7 h-7 bg-white dark:bg-okhovat-800 rounded-full border border-okhovat-100 dark:border-okhovat-700 flex items-center justify-center shadow-sm">
                  <Camera size={13} className="text-okhovat-600 dark:text-okhovat-300" />
                </button>
              </div>
              <div>
                <h2 className="text-lg font-bold text-okhovat-800 dark:text-okhovat-100">علی محمدی</h2>
                <p className="text-sm text-okhovat-500 dark:text-okhovat-400 mt-0.5">کد گروهی: ۱۰۲۴ · حلقه سلمان</p>
              </div>
            </div>
          </div>

          {/* Four independent stat boxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <StatBox label="پست" value="۱۲" />
            <StatBox label="دنبال‌کننده" value="۴۸" />
            <StatBox label="دنبال‌شونده" value="۳۲" />
            <StatBox label="گزارش رشد" value="۲۷" />
          </div>

          {/* Attendance card */}
          <div className="card p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-okhovat-500" />
              <h3 className="font-semibold text-okhovat-800 dark:text-okhovat-100">حضور</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-okhovat-50 dark:bg-okhovat-900 text-center">
                <p className="text-xl font-bold text-okhovat-700 dark:text-okhovat-200">۸۶٪</p>
                <p className="text-xs text-okhovat-500 mt-0.5">حضور من</p>
              </div>
              <div className="p-3 rounded-xl bg-okhovat-50 dark:bg-okhovat-900 text-center">
                <p className="text-xl font-bold text-okhovat-700 dark:text-okhovat-200">۷۸٪</p>
                <p className="text-xs text-okhovat-500 mt-0.5">میانگین حلقه</p>
              </div>
            </div>
          </div>

          {/* My Status */}
          <div className="card p-5 mb-4">
            <h3 className="font-semibold text-okhovat-800 dark:text-okhovat-100 mb-3">وضعیت من</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-okhovat-50 dark:bg-okhovat-900">
                <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                  <Dumbbell size={16} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-okhovat-800 dark:text-okhovat-100">برنامه ورزشی</p>
                  <p className="text-xs text-okhovat-500">هنوز تنظیم نشده</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-okhovat-50 dark:bg-okhovat-900">
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <BookOpen size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-okhovat-800 dark:text-okhovat-100">کتاب در حال مطالعه</p>
                  <p className="text-xs text-okhovat-500">هنوز انتخاب نشده</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coach messages */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={18} className="text-okhovat-500" />
              <h3 className="font-semibold text-okhovat-800 dark:text-okhovat-100">پیام‌های مربی</h3>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
              <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
                علی جان، پیشرفت خوبی در مطالعه داشتی این هفته. سعی کن منظم‌تر فرم رشد رو پر کنی. موفق باشی 🌟
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">مربی احمدی · ۲ روز پیش</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-3.5 text-center">
      <p className="text-xl font-bold text-okhovat-700 dark:text-okhovat-200">{value}</p>
      <p className="text-xs text-okhovat-500 dark:text-okhovat-400 mt-0.5">{label}</p>
    </div>
  )
}
