'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const duration = 2200 // ms
    const interval = 30
    const steps = duration / interval
    let current = 0

    const timer = setInterval(() => {
      current += 1
      const newProgress = Math.min(Math.round((current / steps) * 100), 100)
      setProgress(newProgress)

      if (newProgress >= 100) {
        clearInterval(timer)
        setTimeout(() => {
          setIsVisible(false)
          setTimeout(onComplete, 400)
        }, 300)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          <div className="text-center">
            <motion.h1
              initial={{ color: '#222222' }}
              animate={{ color: progress > 80 ? '#ffffff' : `rgb(${34 + progress * 2}, ${34 + progress * 2}, ${34 + progress * 2})` }}
              transition={{ duration: 0.1 }}
              className="text-6xl md:text-8xl font-bold tracking-tight"
            >
              اخوت
            </motion.h1>
            <motion.p
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0.8 }}
              className="mt-4 text-sm text-gray-400 tracking-widest"
            >
              loading... {progress} %
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
