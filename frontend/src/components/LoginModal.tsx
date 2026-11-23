'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, EyeOff, Loader2 } from 'lucide-react'
import { login, forgotPassword, resetPassword } from '@/lib/api'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess?: (user: any) => void
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [groupCode, setGroupCode] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const resetForm = () => {
    setError('')
    setMode('login')
    setOtpSent(false)
    setOtp('')
    setNewPassword('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(groupCode.trim(), password)
      onLoginSuccess?.(data.user)
      handleClose()
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
        const data = await resetPassword(groupCode.trim(), otp, newPassword)
        onLoginSuccess?.(data.user)
        handleClose()
      }
    } catch (err: any) {
      setError(err.message || 'خطا در بازیابی رمز')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className="relative bg-white dark:bg-okhovat-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-okhovat-100 dark:border-okhovat-800"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-okhovat-50 dark:bg-okhovat-800 hover:bg-okhovat-100 dark:hover:bg-okhovat-700 flex items-center justify-center z-10 transition"
            >
              <X size={16} className="text-okhovat-600 dark:text-okhovat-300" />
            </button>

            <div className="pt-8 pb-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-okhovat-500 flex items-center justify-center text-white text-xl font-bold mb-3 shadow-sm">
                ا
              </div>
              <h2 className="text-lg font-bold text-okhovat-800 dark:text-okhovat-100">
                {mode === 'login' ? 'ورود به اخوت' : 'بازیابی رمز عبور'}
              </h2>
              <p className="text-sm text-okhovat-500 dark:text-okhovat-400 mt-1">
                {mode === 'login'
                  ? 'با کد گروهی و رمز عبور وارد شو'
                  : 'کد ۴ رقمی به آیدی بله شما ارسال می‌شود'}
              </p>
            </div>

            <div className="px-6 pb-6">
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
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-okhovat-400"
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
                    }}
                    className="w-full text-sm text-okhovat-600 dark:text-okhovat-400 py-1"
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
                      <div className="rounded-xl bg-okhovat-50 dark:bg-okhovat-800 px-4 py-3 text-sm text-okhovat-700 dark:text-okhovat-200 text-center">
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
                    }}
                    className="w-full text-sm text-okhovat-500 py-1"
                  >
                    بازگشت به ورود
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
