'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, ScanLine, ShieldCheck, SlidersHorizontal, PanelsTopLeft, ChartNoAxesCombined, Headphones, Star, ChevronDown, ChevronLeft, ChevronRight, Pause, Play, Zap, CandlestickChart, Target } from 'lucide-react';
import { products, money } from '@/data/products';
import { supportHref, orbAccessHref } from '@/data/site-config';
import { testimonials } from '@/data/testimonials';
import { faqs } from '@/data/faqs';
import { demos } from '@/data/demos';
import { Reveal, SectionHeading } from '@/components/ui';
import type { Product } from '@/types';

export function AccessCTA({ className = '' }: { className?: string }) {
  return <a href={orbAccessHref} className={'button button-primary access-cta ' + className} target="_blank" rel="noopener noreferrer">Get ORB Access</a>;
}
export function ReviewSummary() {
  const rated = testimonials.filter(review => review.rating !== undefined);
  if (!rated.length) return null;
  const average = rated.reduce((sum, review) => sum + review.rating!, 0) / rated.length;
  return <Link className="review-summary" href="/#reviews" aria-label={average.toFixed(1) + ' out of 5 from ' + rated.length + ' customer reviews'}>
    <span className="summary-avatars" aria-hidden="true">{testimonials.slice(0,5).map(review => <span key={review.id}>{review.displayName[0]}</span>)}</span>
    <span className="summary-stars" aria-hidden="true">★★★★★</span><b>{average.toFixed(1)}</b><span>from {rated.length} customer reviews</span>
  </Link>;
}
export function TestimonialsSection() {
  const [all, setAll] = useState(false);
  return <section className="section reviews-section" id="reviews"><div className="container">
    <SectionHeading eyebrow="" title="Trader Feedback on" blue="Agent Jin V1">Customer reviews supplied by jinxlab.</SectionHeading>
    <ReviewSummary/>
    <div className="review-grid">{testimonials.slice(0, all ? undefined : 6).map(review => <article className="review-card" key={review.id}>
      <div className="review-person"><span className="review-avatar">{review.displayName.split(' ').map(part => part[0]).join('')}</span><strong>{review.displayName}</strong>
        {review.rating !== undefined && <span className="stars" aria-label={review.rating + ' out of 5 stars'}>{Array.from({length:5}, (_,i) => <Star key={i} size={12} fill={i < review.rating! ? 'currentColor' : 'none'}/>)}</span>}
      </div><p>{review.text}</p>
    </article>)}</div>
    {testimonials.length > 6 && <button className="review-toggle" aria-expanded={all} onClick={() => setAll(!all)}>{all ? 'Show fewer reviews' : 'Show more reviews'}<ChevronDown size={15}/></button>}
    <AccessCTA/>
  </div></section>;
}
export function StrategySection() {
  const [selected, setSelected] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (stopped || interacting || focused || reduced) return;
    const timer = window.setInterval(() => { if (document.visibilityState === 'visible') setSelected(index => (index + 1) % demos.length); }, 5000);
    return () => window.clearInterval(timer);
  }, [stopped, interacting, focused, reduced]);
  const demo = demos[selected];
  return <section className="section strategy-section" id="strategy"><div className="container">
    <SectionHeading eyebrow="" title="See Agent Jin V1 Map the" blue="Trade in Real Time">Watch the supplied buy and sell chart demonstrations.<br className="desktop-break"/> Explore the examples before discussing the system with jinxlab.</SectionHeading>
    <div className="trade-demo" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <div className="demo-tabs" role="tablist" aria-label="Trade demonstration">{demos.map((item,index) => <button key={item.id} id={'demo-tab-' + item.id} role="tab" aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} aria-controls="trade-demo-panel" onClick={() => setSelected(index)} onKeyDown={event => { if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return; event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? demos.length - 1 : (selected + 1) % demos.length; setSelected(next); document.getElementById('demo-tab-' + demos[next].id)?.focus(); }}>{item.label}</button>)}</div>
      <div className="demo-frame">
        <button className="demo-prev icon-button" aria-label="Previous demonstration" onClick={() => setSelected((selected + demos.length - 1) % demos.length)}><ChevronLeft size={22}/></button>
        <div id="trade-demo-panel" role="tabpanel" aria-labelledby={'demo-tab-' + demo.id}><div className="reference-video demo-animation"><picture><source media="(prefers-reduced-motion: reduce)" srcSet={demo.poster}/><Image key={demo.id} src={demo.gif} alt={demo.description} width={1440} height={988} sizes="(max-width: 767px) 94vw, 930px" unoptimized/></picture></div></div>
        <button className="demo-next icon-button" aria-label="Next demonstration" onClick={() => setSelected((selected + 1) % demos.length)}><ChevronRight size={22}/></button>
      </div>
      <div className="demo-caption"><span>{demo.description}</span><button className="demo-pause" aria-label={stopped ? 'Resume demo rotation' : 'Pause demo rotation'} onClick={() => setStopped(!stopped)}>{stopped ? <Play size={12}/> : <Pause size={12}/>}{stopped ? 'Resume' : 'Auto changes every 5 sec'}</button></div>
    </div>
    <div className="demo-feature-grid">
      {[{icon:ScanLine,title:'Buy-Side Example',text:'Watch the supplied buy demonstration and its chart annotations.'},{icon:CandlestickChart,title:'Sell-Side Example',text:'Explore the supplied sell demonstration in the same chart view.'},{icon:Target,title:'A Clearer Trade View',text:'Follow the supplied chart examples as silent, looping animations.'},{icon:SlidersHorizontal,title:'Your Trading Workflow',text:'Confirm platform, settings, and available execution options before purchase.'}].map(({icon:Icon,title,text}) => <article key={title}><span className="feature-icon"><Icon size={20}/></span><h3>{title}</h3><p>{text}</p></article>)}
    </div>
  </div></section>;
}
export function PerformanceNotes() {
  return <div className="workflow-notes">
    <article><span className="feature-icon"><Zap size={20}/></span><div><h3>Manual or <span>Automated</span></h3><p>Discuss the execution mode, platform, and available settings for Agent Jin V1 with jinxlab.</p></div></article>
    <article><span className="feature-icon"><CandlestickChart size={20}/></span><div><h3>Explore <span>Agent Jin V1</span></h3><p>A supplied historical report, buy and sell demonstrations, and one focused trading system.</p></div></article>
  </div>;
}
const features = [
  { icon: ChartNoAxesCombined, title: 'Historical Performance', copy: 'Inspect the supplied v1.1 admin report with its period and limitations clearly stated.' },
  { icon: CandlestickChart, title: 'Buy & Sell Demonstrations', copy: 'Explore both supplied buy and sell examples as looping GIF animations.' },
  { icon: SlidersHorizontal, title: 'Product Configuration', copy: 'Request the product parameter list and confirm the available settings for your workflow.' },
  { icon: PanelsTopLeft, title: 'Platform Compatibility', copy: 'Confirm the supported execution platform and requirements before purchase.' },
  { icon: ShieldCheck, title: 'Risk Information', copy: 'Review drawdown context and the risks of automated trading before making a decision.' },
  { icon: Headphones, title: 'Direct Telegram Contact', copy: 'Contact jinxlab directly for product information, access enquiries, and support details.' },
];
export function FeaturesSection() {
  return <section className="section features-section" id="features"><div className="container"><SectionHeading eyebrow="" title="Explore the Details of" blue="Agent Jin V1">The evidence, information, and next steps in one place.</SectionHeading><div className="features-grid">{features.map(({icon:Icon,title,copy}) => <Reveal key={title}><article className="feature-card"><span className="feature-icon"><Icon size={21}/></span><h3>{title}</h3><p>{copy}</p></article></Reveal>)}</div></div></section>;
}
export function ProductArtwork({ product, priority = false }: { product: Product; priority?: boolean }) {
  return <div className="product-artwork"><Image src={product.image} alt={product.name + ' product artwork'} width={1440} height={988} sizes="(max-width:767px) 94vw, 560px" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'}/></div>;
}
export function PurchaseAction({ product }: { product: Product }) {
  return <><AccessCTA/><p className="purchase-note">Discuss {product.name} access on Telegram. No payment is collected here.</p></>;
}
export function PricingSection() {
  return <section className="section pricing-section" id="pricing"><div className="container"><div id="products" className="anchor-point"/><div className="pricing-grid">{products.map(product => <article className="pricing-card" key={product.slug}>
    <h2>{product.name}</h2><p className="pricing-intro">Explore the system and discuss access<br/>directly with jinxlab.</p>
    <div className="price-value"><s>{money(product.originalPrice!)}</s><strong>{money(product.price!)}<small>USD</small></strong><span className="discount-label">{product.discountPercent}% OFF · Save {money(product.originalPrice! - product.price!)}</span></div>
    <p className="offer-soon">Offer closes soon</p>
    <ul>{product.features.map(feature => <li key={feature}><Check size={16}/>{feature}</li>)}</ul>
    <PurchaseAction product={product}/>
    <Link className="product-details-link" href={'/products/' + product.slug + '/'}>View full product details<ArrowUpRight size={14}/></Link>
    <p className="pricing-terms">Confirm platform, license, delivery, and support terms before purchase.</p>
  </article>)}</div></div></section>;
}
export function FAQSection() {
  return <section className="section faq-section" id="faq"><div className="narrow-container"><SectionHeading eyebrow="" title="FAQ"/><div className="faq-list">{faqs.map((faq,index) => <details key={faq.q} className="faq-item" name="frequently-asked"><summary>{faq.q}<span className="faq-plus" aria-hidden="true"/></summary><div className="faq-answer"><p>{faq.a}</p>{index === 8 && <a href={supportHref} target="_blank" rel="noopener noreferrer">Contact jinxlab on Telegram<ArrowUpRight size={14}/></a>}</div></details>)}</div></div></section>;
}
export function FinalCTA() {
  return <section className="final-cta"><div className="container"><h2>Bring Structure to Your Trading.<br/><span>Start With One Clear Workflow.</span></h2><p>Explore Agent Jin V1 and JinX ORB Scalper V2 with jinxlab.</p><AccessCTA/><ReviewSummary/></div></section>;
}
