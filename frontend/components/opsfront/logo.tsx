import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="relative flex size-7 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
        <svg
          viewBox="0 0 24 24"
          className="size-4 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2v4" />
          <path d="M12 22v-4" />
          <path d="m4.9 4.9 2.9 2.9" />
          <path d="m16.2 16.2 2.9 2.9" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        Opsfront
      </span>
    </div>
  )
}
