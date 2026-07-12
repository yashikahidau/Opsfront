import { Reveal } from './reveal'

const ITEMS = [
  'Built for internal support teams',
  'AI-assisted triage',
  'SLA-aware workflows',
  'Role-based visibility',
  'Audit-ready by default',
]

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Reveal className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            The operating layer for support operations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {ITEMS.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span className="size-1 rounded-full bg-primary/60" />
                {item}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
