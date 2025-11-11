'use client'

import { usePathname } from '@/i18n/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Admin and vendor dashboards have their own complete layouts with sidebar
  // So we don't render the main header/footer for those pages
  const isDashboardPage = pathname.startsWith('/admin') || pathname.startsWith('/vendor')

  if (isDashboardPage) {
    // Dashboard pages handle their own layout
    return <>{children}</>
  }

  // Regular pages get the normal header/footer
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
