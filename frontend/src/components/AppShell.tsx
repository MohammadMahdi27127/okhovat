'use client'

import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

interface AppShellProps {
  children: React.ReactNode
  role?: 'member' | 'coach' | 'admin'
  onLoginClick?: () => void
  userName?: string
  hideNav?: boolean
}

export default function AppShell({
  children,
  role = 'member',
  onLoginClick,
  userName,
  hideNav = false,
}: AppShellProps) {
  if (hideNav) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-okhovat-950">
      <Sidebar role={role} onLoginClick={onLoginClick} userName={userName} />
      <main className="md:mr-64 pb-24 md:pb-6">
        {children}
      </main>
      <MobileNav role={role} />
    </div>
  )
}
