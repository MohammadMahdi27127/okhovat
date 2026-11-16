'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, EyeOff } from 'lucide-react'
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(groupCode, password)
      onLoginSuccess?.(data.user)
      onClose()
    } catch (err: any) {
      setError(err.message || 'خطا در ورود')
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
        await forgotPassword(groupCode)
        setOtpSent(true)
      } else {
        const data = await resetPassword(groupCode, otp, newPassword)
        onLoginSuccess?.(data.user)
        onClose()
        setMode('login')
        setOtpSent(false)
        setOtp('')
        setNewPassword('')
      }
    } catch (err: any) {
      setError(err.message || 'خطا')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center z-10">
              <X size={16} className="text-slate-600" />
            </button>

            <div className="pt-8 pb-4 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-okhovat-600 flex items-center justify-center text-white text-2xl font-bold mb-3">ا</div>
              <h2 className="text-xl font-bold text-slate-800">{mode === 'login' ? 'ورود به اخوت' : 'بازیابی رمز عبور'}</h2>
              <p className="text-sm text-slate-500 mt-1">
                {mode === 'login' ? 'با کد گروهی و رمز عبور وارد شو' : 'کد ۴ رقمی به آیدی بله شما ارسال می‌شود'}
              </p>
            </div>

            <div className="px-6 pb-6">
              {mode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">کد گروهی</label>
                    <input type="text" value={groupCode} onChange={(e) => setGroupCode(e.target.value)} placeholder="کد گروهی" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">رمز عبور</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="رمز عبور" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500 pl-12" dir="ltr" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                  <button type="submit" disabled={loading} className="w-full bg-okhovat-600 hover:bg-okhovat-700 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition">
                    {loading ? 'در حال ورود...' : 'ورود به اخوت'}
                  </button>
                  <button type="button" onClick={() => { setMode('forgot'); setError('') }} className="w-full text-sm text-okhovat-600 py-1">
                    رمز عبور را فراموش کردی؟
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  {!otpSent ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">کد گروهی</label>
                        <input type="text" value={groupCode} onChange={(e) => setGroupCode(e.target.value)} placeholder="کد گروهی" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500" dir="ltr" />
                      </div>
                      <button type="submit" disabled={loading || !groupCode} className="w-full bg-okhovat-600 hover:bg-okhovat-700 disabled:opacity-60 text-white font-medium py-3 rounded-xl">
                        {loading ? 'در حال ارسال...' : 'ارسال کد به بله'}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-okhovat-50 rounded-xl text-sm text-okhovat-800 text-center">
                        کد ۴ رقمی به آیدی بله مرتبط ارسال شد (۵ دقیقه اعتبار).
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">کد ۴ رقمی</label>
                        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.slice(0, 4))} placeholder="----" maxLength={4} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-okhovat-500" dir="ltr" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">رمز جدید</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="حداقل ۶ کاراکتر" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-okhovat-500" dir="ltr" />
                      </div>
                      <button type="submit" disabled={loading} className="w-full bg-okhovat-600 hover:bg-okhovat-700 disabled:opacity-60 text-white font-medium py-3 rounded-xl">
                        {loading ? 'در حال ثبت...' : 'تنظیم رمز و ورود'}
                      </button>
                    </>
                  )}
                  {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                  <button type="button" onClick={() => { setMode('login'); setOtpSent(false); setError('') }} className="w-full text-sm text-slate-500 py-1">
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
