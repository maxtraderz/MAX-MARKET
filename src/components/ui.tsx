'use client';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronRight, X, Pause, Play } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useState } from 'react';
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduced ? {} : { opacity: [0.6, 1], y: [16, 0] }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.45 }}>{children}</motion.div>;
}
export function SectionHeading({ eyebrow, title, blue, children }: { eyebrow: string; title: string; blue?: string; children?: ReactNode }) {
  return <div className="section-heading"><span className="eyebrow"><span />{eyebrow}</span><h2>{title} {blue && <span className="text-blue">{blue}</span>}</h2>{children && <p>{children}</p>}</div>;
}
export function ActionLink({ href, children, secondary = false, className = '' }: { href: string; children: ReactNode; secondary?: boolean; className?: string }) {
  return <a href={href} className={'button ' + (secondary ? 'button-secondary ' : 'button-primary ') + className}>{children}<ArrowUpRight size={17} aria-hidden="true" /></a>;
}
export function Carousel({ children, label, className = '', autoplayMs = 0, paused = false }: {
  children: ReactNode[]; label: string; className?: string; autoplayMs?: number; paused?: boolean;
}) {
  const reduced = useReducedMotion();
  const [emblaRef, api] = useEmblaCarousel({ align: 'start', loop: autoplayMs > 0, duration: reduced ? 0 : 25, containScroll: 'trimSnaps' });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const update = useCallback(() => {
    if (api) { setSelected(api.selectedScrollSnap()); setSnaps(api.scrollSnapList()); }
  }, [api]);
  useEffect(() => {
    if (!api) return;
    const frame = requestAnimationFrame(update);
    api.on('select', update).on('reInit', update);
    return () => { cancelAnimationFrame(frame); api.off('select', update).off('reInit', update); };
  }, [api, update]);
  useEffect(() => {
    if (!api || !autoplayMs || reduced || paused || hovered || focused || stopped || children.length < 2) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') api.scrollNext();
    }, autoplayMs);
    return () => window.clearInterval(timer);
  }, [api, autoplayMs, reduced, paused, hovered, focused, stopped, children.length]);
  return <div className={'carousel ' + className} role="region" aria-roledescription="carousel" aria-label={label}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    onKeyDown={event => {
      if (event.target instanceof HTMLButtonElement && !event.target.classList.contains('proof-open')) return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); api?.scrollPrev(); }
      if (event.key === 'ArrowRight') { event.preventDefault(); api?.scrollNext(); }
    }}>
    <div className="carousel-viewport" ref={emblaRef}><div className="carousel-track">{children.map((child, i) =>
      <div className="carousel-slide" key={i} role="group" aria-roledescription="slide" aria-label={(i + 1) + ' of ' + children.length}>{child}</div>
    )}</div></div>
    {snaps.length > 1 && <div className="carousel-controls">
      <div className="dots">{snaps.map((_, i) => <button type="button" key={i} aria-label={'Go to slide ' + (i + 1)} aria-current={i === selected ? 'true' : undefined} className={i === selected ? 'active' : ''} onClick={() => api?.scrollTo(i)} />)}</div>
      <div className="arrow-pair">
        {autoplayMs > 0 && !reduced && <button className="icon-button autoplay-toggle" aria-label={stopped ? 'Resume slideshow' : 'Pause slideshow'} aria-pressed={stopped} onClick={() => setStopped(!stopped)}>{stopped ? <Play size={15}/> : <Pause size={15}/>}</button>}
        <button className="icon-button" aria-label="Previous slide" disabled={!autoplayMs && selected === 0} onClick={() => api?.scrollPrev()}><ChevronLeft size={19}/></button>
        <button className="icon-button" aria-label="Next slide" disabled={!autoplayMs && selected === snaps.length - 1} onClick={() => api?.scrollNext()}><ChevronRight size={19}/></button>
      </div>
    </div>}
  </div>;
}
export function Modal({ children, label, onClose, onPrevious, onNext }: { children: ReactNode; label: string; onClose: () => void; onPrevious?: () => void; onNext?: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const callbacks = useRef({ onClose, onPrevious, onNext });
  useEffect(() => { callbacks.current = { onClose, onPrevious, onNext }; });
  useEffect(() => {
    const el = dialog.current; const previousFocus = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    el?.showModal(); close.current?.focus(); document.body.style.overflow = 'hidden';
    const keyboard = (event: KeyboardEvent) => { if (event.key === 'ArrowLeft') { event.preventDefault(); callbacks.current.onPrevious?.(); } if (event.key === 'ArrowRight') { event.preventDefault(); callbacks.current.onNext?.(); } };
    el?.addEventListener('keydown', keyboard);
    return () => { el?.removeEventListener('keydown', keyboard); el?.close(); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, []);
  return <dialog ref={dialog} className="lightbox" aria-label={label} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <button ref={close} className="lightbox-close icon-button" aria-label="Close enlarged image" onClick={onClose}><X /></button>
    <div className="lightbox-content">{children}</div>
    {onPrevious && <button className="lightbox-prev icon-button" aria-label="Previous certificate" onClick={onPrevious}><ChevronLeft /></button>}
    {onNext && <button className="lightbox-next icon-button" aria-label="Next certificate" onClick={onNext}><ChevronRight /></button>}
  </dialog>;
}
