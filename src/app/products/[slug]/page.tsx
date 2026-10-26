import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, Info, ArrowUpRight } from 'lucide-react';
import { products, money } from '@/data/products';
import { siteConfig, supportHref } from '@/data/site-config';
import { ProductArtwork, PurchaseAction } from '@/components/sections/Content';
export const dynamicParams = false;
export function generateStaticParams() { return products.map(p => ({slug:p.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> {
  const {slug}=await params; const p=products.find(p=>p.slug===slug);
  return {title:p?.name || 'Product',description:p?.description,alternates:{canonical:'/products/' + slug + '/'}};
}
export default async function ProductPage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params; const p=products.find(p=>p.slug===slug); if (!p) notFound();
  return <><section className="product-detail container"><Link className="back-link" href="/#products"><ArrowLeft size={15}/>Back to the collection</Link><div className="detail-grid"><ProductArtwork product={p} priority/><div className="detail-copy"><span className="eyebrow">{p.label}</span><h1>{p.name}</h1><p>{p.description}</p><div className="detail-specs"><div><span>Execution platform</span><strong>{p.platform || 'To be confirmed'}</strong></div><div><span>License model</span><strong>{p.license || 'To be confirmed'}</strong></div><div><span>Version</span><strong>{p.version || 'To be confirmed'}</strong></div></div><ul className="detail-features">{p.features.map(f=><li key={f}><Check size={16}/>{f}</li>)}</ul><div className="detail-price">{p.price !== null ? <><s>{money(p.originalPrice!)}</s><strong>{money(p.price)}<small>USD</small></strong><span className="badge">{p.discountPercent}% OFF · SAVE {money(p.originalPrice! - p.price)}</span></> : <strong>Contact for pricing.</strong>}</div><p className="offer-soon">Offer closes soon</p><PurchaseAction product={p}/></div></div><div className="detail-lower"><article><span className="eyebrow">PRODUCT EVIDENCE</span><h2>{p.slug==='agent-jin' ? 'A historical report, with context.' : 'Performance evidence, when available.'}</h2><p>{p.slug==='agent-jin' ? 'A supplied Agent Jin 1.1 admin screenshot shows historical results on an axis labelled 2020–2026. It is not independently audited, and its live versus backtest status is unconfirmed. It does not establish performance of either advertised product.' : 'No authentic performance report has been supplied for this product. No results from another system are used in its place.'}</p>{p.slug === 'agent-jin' && <Link href={'/#performance'}>Explore performance<ArrowUpRight size={16}/></Link>}</article><article><span className="eyebrow">BEFORE YOU PURCHASE</span><h2>Make an informed decision.</h2><p>Confirm supported platform, available parameters, risk controls, license activation, delivery, support, and applicable purchase terms. Checkout is enabled only when a genuine product-specific payment URL is configured.</p><a href={supportHref}>Contact for product details<ArrowUpRight size={16}/></a></article></div><div className="notice"><Info size={20}/><p>{siteConfig.risk}</p></div></section></>;
}
