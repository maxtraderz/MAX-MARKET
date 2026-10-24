'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Expand, ShieldCheck } from 'lucide-react';
import { certificates } from '@/data/certificates';
import { SectionHeading, Reveal, Carousel, Modal } from '@/components/ui';
import { AccessCTA } from '@/components/sections/Content';
export function PayoutGallery() {
  const [active,setActive] = useState<number | null>(null);
  const current = active === null ? null : certificates[active];
  const rows = [certificates.slice(0, 4), certificates.slice(4, 8), certificates.slice(8)];
  return <section className="section proof-section" id="proof"><div className="container"><Reveal><SectionHeading eyebrow="THE CERTIFICATE COLLECTION" title="Supplied Payouts and" blue="Funded Account Certificates">A collection of supplied prop-firm certificates and payout records,<br className="desktop-break"/> presented with recipient details hidden for privacy.</SectionHeading></Reveal><div className="proof-rows">{rows.map((items, row) => <div className="proof-row" key={row}>
      <Carousel label={'Gallery, row ' + (row + 1)} className="proof-carousel" autoplayMs={row < 2 ? 5000 : 0} paused={active !== null}>
        {items.map(c => <div className={'proof-card' + (c.type === 'Product showcase' ? ' proof-showcase' : '')} key={c.id}>
          <button className="proof-open" onClick={() => setActive(certificates.indexOf(c))} aria-label={c.type === 'Product showcase' ? 'Enlarge AGENT JIN product showcase' : 'Enlarge anonymous certificate ' + c.id}>
            <Image src={c.src} alt={c.alt} width={820} height={600} sizes="(max-width: 767px) 90vw, 820px" className="certificate-image"/>
            <span className="expand-badge"><Expand size={15}/></span>
          </button>
          <div className="proof-caption"><div><span>{c.type}</span><strong>{c.issuer}</strong></div><span className="proof-number">{String(c.id).padStart(2, '0')}</span></div>
        </div>)}
      </Carousel>
    </div>)}</div><div className="proof-disclosure"><ShieldCheck size={18}/><p>Recipient details are permanently removed from all published certificate images. These supplied records are not independently verified or attributed to AGENT JIN.</p></div><AccessCTA/></div>{current && active !== null && <Modal label={current.type === 'Product showcase' ? 'AGENT JIN product showcase' : 'Anonymous certificate ' + current.id + ' of 9'} onClose={() => setActive(null)} onPrevious={() => setActive((active+8)%9)} onNext={() => setActive((active+1)%9)}><div className="lightbox-swipe" onTouchStart={e => { e.currentTarget.dataset.startX = String(e.touches[0].clientX); }} onTouchEnd={e => { const delta = e.changedTouches[0].clientX - Number(e.currentTarget.dataset.startX); if (Math.abs(delta) > 50) setActive((active + (delta < 0 ? 1 : 8)) % 9); }}><Image src={current.src} alt={current.alt} width={2200} height={1600} sizes="96vw" quality={100}/><p>{current.type} · {current.issuer} · {active + 1} / 9</p></div></Modal>}</section>;
}
