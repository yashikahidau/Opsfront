import { cn } from '@/lib/utils'
import { Reveal } from './reveal'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'center' | 'left'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'flex flex-col gap-3',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-primary">
        {eyebrow}
      </span>
      <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </Reveal>
  )
}
