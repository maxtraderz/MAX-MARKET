'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { siteConfig, supportHref } from '@/data/site-config';
const navigation = [['Performance','performance'],['Payout Proof','proof'],['Demos','strategy'],['Pricing','pricing'],['FAQ','faq']];
export function Brand() {
  return <Link href="/" className="brand" aria-label="jinxlab home">jinxlab</Link>;
}
export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const fn = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [open]);
  return <header className="site-header"><div className="container header-inner"><Brand/>
    <nav aria-label="Main navigation" id="main-nav" className={open ? 'navigation is-open' : 'navigation'}>{navigation.map(([label,id]) => <Link key={id} href={'/#' + id} onClick={() => setOpen(false)}>{label}</Link>)}</nav>
    <a href={supportHref} className="header-contact" target="_blank" rel="noopener noreferrer">Telegram</a>
    <button ref={toggle} className="mobile-toggle icon-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
  </div></header>;
}
export function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-top"><div className="footer-brand"><Brand/><p>Trading automation.<br/>A structured approach.</p></div>
    <div><h3>Explore</h3><Link href="/products/agent-jin/">Agent Jin V1</Link><Link href="/products/jinx-orb-scalper-v2/">JinX ORB Scalper V2</Link><Link href="/#performance">Performance</Link><Link href="/#proof">Certificate gallery</Link></div>
    <div><h3>Support</h3><a href={supportHref} target="_blank" rel="noopener noreferrer">Contact on Telegram</a>{siteConfig.contact.email && <a href={'mailto:' + siteConfig.contact.email}>{siteConfig.contact.email}</a>}<Link href="/contact/#installation">Installation help</Link><Link href="/#faq">FAQ</Link></div>
    <div><h3>Legal</h3><Link href="/legal/terms/">Terms of service</Link><Link href="/legal/privacy/">Privacy policy</Link><Link href="/legal/risk/">Risk disclosure</Link></div>
  </div><p className="risk-footer">{siteConfig.risk}</p><div className="footer-bottom"><span>© {new Date().getFullYear()} jinxlab. All rights reserved.</span><a href={supportHref} target="_blank" rel="noopener noreferrer">t.me/jinzfx</a></div></div></footer>;
}
