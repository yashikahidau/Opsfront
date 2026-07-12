import { SiteHeader } from '@/components/opsfront/site-header'
import { Hero } from '@/components/opsfront/hero'
import { TrustStrip } from '@/components/opsfront/trust-strip'
import { ValueProps } from '@/components/opsfront/value-props'
import { CockpitShowcase } from '@/components/opsfront/cockpit-showcase'
import { Workflow } from '@/components/opsfront/workflow'
import { FeatureGrid } from '@/components/opsfront/feature-grid'
import { DeepDive } from '@/components/opsfront/deep-dive'
import { AnalyticsSection } from '@/components/opsfront/analytics'
import { FinalCta } from '@/components/opsfront/final-cta'
import { SiteFooter } from '@/components/opsfront/site-footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <TrustStrip />
        <ValueProps />
        <CockpitShowcase />
        <Workflow />
        <FeatureGrid />
        <DeepDive />
        <AnalyticsSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
