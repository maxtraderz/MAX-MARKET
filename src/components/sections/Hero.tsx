import { products } from '@/data/products';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ReviewSummary, AccessCTA } from '@/components/sections/Content';
export function Hero() {
  const product = products[0];
  return <section className="hero" id="top"><div className="container hero-inner">
    <h1>Automate with precision.<br/>Trade with discipline.<br/>Discover AGENT JIN v3.</h1>
    <VideoPlayer src={product.demoVideo!} poster={product.demoPoster!} label="AGENT JIN promotional video" hero/>
    <p className="hero-description">Explore a structured trading workflow with AGENT JIN v3.<br className="desktop-break"/> Watch the supplied demonstrations and inspect the historical report.</p>
    <ReviewSummary/>
    <AccessCTA/>
    <div className="hero-chips"><span>Historical performance report</span><span>Buy & sell demonstrations</span><span>AGENT JIN v3</span></div>
  </div></section>;
}
