import type { Metadata } from 'next';
export const metadata: Metadata = { alternates: { canonical: '/' } };
import { Hero } from '@/components/sections/Hero';
import { PerformanceSection } from '@/components/sections/Performance';
import { MarketChart } from '@/components/sections/Gallery';
import { TestimonialsSection, StrategySection, FeaturesSection, PricingSection, FAQSection, FinalCTA } from '@/components/sections/Content';
export default function Home() {
  return <><Hero/><PerformanceSection/><MarketChart/><TestimonialsSection/><StrategySection/><FeaturesSection/><PricingSection/><FAQSection/><FinalCTA/></>;
}
