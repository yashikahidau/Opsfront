'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Radar,
  Search,
  SlidersHorizontal,
} from 'lucide-react'

type Risk = 'critical' | 'high' | 'medium' | 'low'

interface Ticket {
  id: string
  title: string
  agent: string
  sla: string
  risk: Risk
  score: number
  stale?: boolean
}

const TICKETS: Ticket[] = [
  {
    id: 'OPS-2481',
    title: 'VPN auth failing for finance team',
    agent: 'D. Cho',
    sla: '18m',
    risk: 'critical',
    score: 94,
    stale: true,
  },
  {
    id: 'OPS-2479',
    title: 'Prod deploy access — data team',
    agent: 'M. Ali',
    sla: '46m',
    risk: 'high',
    score: 81,
  },
  {
    id: 'OPS-2475',
    title: 'Laptop provisioning for new hires',
    agent: 'K. Park',
    sla: '2h 10m',
    risk: 'medium',
    score: 58,
  },
  {
    id: 'OPS-2470',
    title: 'Grafana dashboard permissions',
    agent: 'S. Reed',
    sla: '5h 30m',
    risk: 'low',
    score: 34,
  },
]

const riskStyles: Record<Risk, string> = {
  critical: 'bg-destructive/15 text-destructive ring-destructive/30',
  high: 'bg-primary/15 text-primary ring-primary/30',
  medium: 'bg-[color:var(--warning)]/15 text-[color:var(--warning)] ring-[color:var(--warning)]/25',
  low: 'bg-[color:var(--success)]/15 text-[color:var(--success)] ring-[color:var(--success)]/25',
}

const riskBar: Record<Risk, string> = {
  critical: 'bg-destructive',
  high: 'bg-primary',
  medium: 'bg-[color:var(--warning)]',
  low: 'bg-[color:var(--success)]',
}

export function CockpitMockup({ className }: { className?: string }) {
  const [liveScore, setLiveScore] = useState(94)
  const [syncing, setSyncing] = useState(true)

  useEffect(() => {
    const scoreTimer = setInterval(() => {
      setLiveScore((s) => {
        const next = s + (Math.random() > 0.5 ? 1 : -1)
        return Math.min(97, Math.max(89, next))
      })
    }, 1400)
    const syncTimer = setInterval(() => setSyncing((v) => !v), 3200)
    return () => {
      clearInterval(scoreTimer)
      clearInterval(syncTimer)
    }
  }, [])

  return (
    <div
      className={cn(
        '@container relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/50 ring-1 ring-white/5',
        className,
      )}
    >
      {/* scan line */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <div className="animate-scan absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent" />
      </div>

      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-background/50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="ml-3 flex items-center gap-2 rounded-md bg-muted/60 px-2.5 py-1 text-[11px] text-muted-foreground">
          <Search className="size-3" />
          opsfront.app / risk-cockpit
        </div>
        <div className="ml-auto flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary ring-1 ring-primary/20">
          <Radar
            className={cn(
              'size-3 transition-opacity',
              syncing ? 'animate-pulse opacity-100' : 'opacity-50',
            )}
          />
          {syncing ? 'SLA scan…' : 'All synced'}
        </div>
      </div>

      {/* section header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div>
          <p className="text-xs font-medium text-foreground">Risk cockpit</p>
          <p className="text-[10px] text-muted-foreground">Live SLA exposure · 4 teams</p>
        </div>
        <span className="rounded-md bg-muted/60 px-2 py-1 font-mono text-[10px] text-muted-foreground">
          Updated 12s ago
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 p-3 sm:p-4 @2xl:grid-cols-[1fr_196px]">
        {/* main column */}
        <div className="min-w-0">
          {/* metric cards */}
          <div className="grid grid-cols-3 gap-2">
            <Metric label="At risk" value="12" delta="+3" trend="up" emphasize />
            <Metric label="Breaching < 1h" value="03" delta="+1" trend="up" tone="destructive" />
            <Metric label="SLA met today" value="97%" delta="+2%" trend="down" tone="success" />
          </div>

          {/* toolbar */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-medium text-foreground">Prioritized queue</span>
            <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
              Ranked by risk
            </span>
            <div className="ml-auto flex items-center gap-1.5 text-muted-foreground">
              <button className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[10px]">
                <SlidersHorizontal className="size-3" /> SLA
              </button>
            </div>
          </div>

          {/* ticket rows */}
          <div className="mt-2 overflow-hidden rounded-lg border border-border">
            {TICKETS.map((t, i) => (
              <div
                key={t.id}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-accent/50',
                  i !== TICKETS.length - 1 && 'border-b border-border',
                  t.risk === 'critical' && 'bg-destructive/[0.06]',
                )}
              >
                <div className="flex w-14 shrink-0 items-center gap-2">
                  <span className={cn('h-8 w-1 rounded-full', riskBar[t.risk])} />
                  <span
                    className={cn(
                      'font-mono text-[11px]',
                      t.risk === 'critical'
                        ? 'font-semibold text-destructive'
                        : 'text-muted-foreground',
                    )}
                  >
                    {t.score}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs font-medium text-foreground">
                      {t.title}
                    </p>
                    {t.stale && (
                      <span className="shrink-0 rounded bg-destructive/15 px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-destructive">
                        Stale
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {t.id} · {t.agent}
                  </p>
                </div>
                <div className="hidden items-center gap-1 text-muted-foreground sm:flex">
                  <Clock className="size-3" />
                  <span className="font-mono text-[10px]">{t.sla}</span>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ring-1',
                    riskStyles[t.risk],
                  )}
                >
                  {t.risk}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* side panel */}
        <div className="grid grid-cols-1 gap-3 @md:grid-cols-3 @2xl:flex @2xl:flex-col">
          <div className="rounded-lg border border-primary/20 bg-primary/[0.06] p-3">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Top risk score
            </p>
            <div className="mt-1 flex items-end gap-1">
              <span className="font-mono text-3xl font-semibold text-primary tabular-nums">
                {liveScore}
              </span>
              <span className="mb-1 text-[10px] text-muted-foreground">/100</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${liveScore}%` }}
              />
            </div>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">
              OPS-2481 · breaching in 18m
            </p>
          </div>

          <div className="rounded-lg border border-border bg-background/40 p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Risk by hour
              </p>
              <span className="font-mono text-[9px] text-muted-foreground">7d</span>
            </div>
            <div className="mt-3 flex items-end gap-1.5">
              {[40, 68, 52, 84, 61, 92, 74].map((h, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex-1 rounded-sm',
                    i === 5 ? 'bg-primary' : 'bg-muted-foreground/25',
                  )}
                  style={{ height: `${h * 0.5}px` }}
                />
              ))}
            </div>
          </div>

          <button className="flex items-center justify-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-[11px] font-medium text-primary">
            View escalations
            <ArrowUpRight className="size-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

function Metric({
  label,
  value,
  delta,
  trend,
  tone = 'muted',
  emphasize,
}: {
  label: string
  value: string
  delta: string
  trend: 'up' | 'down'
  tone?: 'muted' | 'destructive' | 'success'
  emphasize?: boolean
}) {
  const valueClass = {
    muted: 'text-foreground',
    destructive: 'text-destructive',
    success: 'text-[color:var(--success)]',
  }[tone]
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight
  return (
    <div
      className={cn(
        'rounded-lg border p-2.5',
        emphasize
          ? 'border-primary/25 bg-primary/[0.06]'
          : 'border-border bg-background/40',
      )}
    >
      <p className="text-[9px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-baseline justify-between">
        <p
          className={cn(
            'font-mono text-lg font-semibold tabular-nums',
            emphasize ? 'text-primary' : valueClass,
          )}
        >
          {value}
        </p>
        <span className="flex items-center gap-0.5 font-mono text-[9px] text-muted-foreground">
          <TrendIcon className="size-2.5" />
          {delta}
        </span>
      </div>
    </div>
  )
}
