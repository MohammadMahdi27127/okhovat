'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { login, forgotPassword, resetPassword } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [groupCode, setGroupCode] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(groupCode.trim(), password)
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'کد گروهی یا رمز عبور اشتباه است')
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!otpSent) {
        await forgotPassword(groupCode.trim())
        setOtpSent(true)
      } else {
        await resetPassword(groupCode.trim(), otp, newPassword)
        router.push('/')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'خطا در بازیابی رمز')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-okhovat-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-okhovat-500 flex items-center justify-center text-white text-2xl font-bold shadow-md mb-3">
            ا
          </div>
          <h1 className="text-2xl font-bold text-okhovat-800 dark:text-okhovat-100">اخوت</h1>
          <p className="text-sm text-okhovat-500 dark:text-okhovat-400 mt-1">کنار هم، رو به رشد</p>
        </div>

        {/* Card */}
        <div className="card p-6 md:p-7">
          <h2 className="text-lg font-bold text-okhovat-800 dark:text-okhovat-100 text-center mb-1">
            {mode === 'login' ? 'ورود به اخوت' : 'بازیابی رمز عبور'}
          </h2>
          <p className="text-sm text-okhovat-500 dark:text-okhovat-400 text-center mb-6">
            {mode === 'login'
              ? 'با کد گروهی و رمز عبور وارد شو'
              : 'کد ۴ رقمی به آیدی بله شما ارسال می‌شود'}
          </p>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-okhovat-700 dark:text-okhovat-200 mb-1.5">
                  کد گروهی
                </label>
                <input
                  type="text"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  placeholder="مثلاً ۱۰۲۴"
                  className="input-field"
                  dir="ltr"
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-okhovat-700 dark:text-okhovat-200 mb-1.5">
                  رمز عبور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="رمز عبور"
                    className="input-field pl-11"
                    dir="ltr"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-okhovat-400 hover:text-okhovat-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 px-4 py-3 text-sm text-red-600 dark:text-red-300 text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !groupCode || !password}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    در حال ورود...
                  </>
                ) : (
                  'ورود به اخوت'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('forgot')
                  setError('')
                  setOtpSent(false)
                }}
                className="w-full text-sm text-okhovat-600 dark:text-okhovat-400 hover:text-okhovat-500 py-1"
              >
                رمز عبور را فراموش کردی؟
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgot} className="space-y-4">
              {!otpSent ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-okhovat-700 dark:text-okhovat-200 mb-1.5">
                      کد گروهی
                    </label>
                    <input
                      type="text"
                      value={groupCode}
                      onChange={(e) => setGroupCode(e.target.value)}
                      placeholder="کد گروهی"
                      className="input-field"
                      dir="ltr"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !groupCode}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        در حال ارسال...
                      </>
                    ) : (
                      'ارسال کد به بله'
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="rounded-xl bg-okhovat-50 dark:bg-okhovat-900 border border-okhovat-100 dark:border-okhovat-800 px-4 py-3 text-sm text-okhovat-700 dark:text-okhovat-200 text-center">
                    کد ۴ رقمی به آیدی بله مرتبط ارسال شد (۵ دقیقه اعتبار).
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-okhovat-700 dark:text-okhovat-200 mb-1.5">
                      کد ۴ رقمی
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                      placeholder="----"
                      maxLength={4}
                      className="input-field text-center tracking-[0.5em]"
                      dir="ltr"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-okhovat-700 dark:text-okhovat-200 mb-1.5">
                      رمز جدید
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="حداقل ۶ کاراکتر"
                      className="input-field"
                      dir="ltr"
                      required
                      minLength={6}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || otp.length < 4 || newPassword.length < 6}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        در حال ثبت...
                      </>
                    ) : (
                      'تنظیم رمز و ورود'
                    )}
                  </button>
                </>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 px-4 py-3 text-sm text-red-600 dark:text-red-300 text-center">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setOtpSent(false)
                  setError('')
                  setOtp('')
                  setNewPassword('')
                }}
                className="w-full text-sm text-okhovat-500 py-1"
              >
                بازگشت به ورود
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-okhovat-400 dark:text-okhovat-500 mt-5">
          <Link href="/" className="hover:text-okhovat-600 transition">
            بازگشت به خانه
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
