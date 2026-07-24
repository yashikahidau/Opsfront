'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from './logo'
import { cn } from '@/lib/utils'
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

const NAV = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Pricing', href: '#' },
  { label: 'Docs', href: '#' },
]

export function SiteHeader() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          'mx-auto flex h-16 max-w-6xl items-center justify-between px-4 transition-all duration-300 sm:px-6',
          scrolled &&
            'mt-2 h-14 max-w-5xl rounded-full border border-border bg-background/70 px-3 backdrop-blur-xl sm:px-4',
        )}
      >
        <a href="#" aria-label="Opsfront home" className="shrink-0">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

      <div className="hidden items-center gap-3 md:flex">
  {user ? (
    <>
      <Link
        href="/dashboard"
        className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        Dashboard
      </Link>

      <Link
        href="/dashboard"
        className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-2 py-1 transition hover:border-primary/20"
      >
        <div className="grid size-8 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
      </Link>
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        Sign in
      </Link>

      <a
        href="#cta"
        className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground"
      >
        Request demo
      </a>
    </>
  )}
</div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-md text-foreground md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="mx-3 mt-2 overflow-hidden rounded-2xl border border-border bg-popover/95 p-2 backdrop-blur-xl md:hidden">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
         <div className="mt-2 space-y-2 p-1">
  {user ? (
    <Link
      href="/dashboard"
      onClick={() => setOpen(false)}
      className="block rounded-lg border border-border px-3 py-2.5 text-center text-sm font-medium text-foreground transition hover:bg-accent"
    >
      Dashboard
    </Link>
  ) : (
    <div className="grid grid-cols-2 gap-2">
      <Link
        href="/login"
        onClick={() => setOpen(false)}
        className="rounded-lg border border-border px-3 py-2 text-center text-sm text-foreground"
      >
        Sign in
      </Link>

      <a
        href="#cta"
        onClick={() => setOpen(false)}
        className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground"
      >
        Request Demo
      </a>
    </div>
  )}
</div>
        </div>
      )}
    </header>
  )
}
