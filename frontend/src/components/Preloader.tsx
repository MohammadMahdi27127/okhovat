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
    const duration = 2000
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
          setTimeout(onComplete, 350)
        }, 250)
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
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#031512]"
        >
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0.3, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-6xl md:text-7xl font-bold tracking-tight text-white"
            >
              اخوت
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5"
            >
              <div className="w-40 h-1 mx-auto bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#0F5C55] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <p className="mt-3 text-xs text-white/50 tracking-widest">{progress}%</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
