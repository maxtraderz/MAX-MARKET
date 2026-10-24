'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Info, ArrowUpRight, ChartNoAxesCombined } from 'lucide-react';
import { performance } from '@/data/performance';
import { SectionHeading, Reveal, Modal } from '@/components/ui';
import { AccessCTA, PerformanceNotes } from '@/components/sections/Content';
export function PerformanceSection() {
  const [expanded,setExpanded] = useState(false);
  const data = performance['agent-jin'];
  return <section className="section performance-section" id="performance"><div className="container"><Reveal><SectionHeading eyebrow="THE PERFORMANCE" title="Explore AGENT JIN’s" blue="Historical Performance">Look closer at the numbers. Explore the supplied historical report with the context that matters.</SectionHeading></Reveal>
    <div id="performance-panel" role="region" aria-label="Agent Jin historical performance report" className="performance-panel">
    <><div className="panel-title"><span><span className="report-symbol"><ChartNoAxesCombined size={18}/></span><b>{data.title}</b><span className="badge">HISTORICAL REPORT</span></span><button onClick={() => setExpanded(true)} className="report-expand">View original report <ArrowUpRight size={15}/></button></div><div className="metrics">{data.metrics.map(m => <div key={m.label} className="metric"><span>{m.label}</span><strong>{m.value}</strong><small>{m.detail}</small></div>)}</div><button className="report-image" onClick={() => setExpanded(true)} aria-label="Enlarge supplied Agent Jin historical report"><Image src={data.image} alt="Agent Jin 1.1 admin historical report: total PnL 556,400.62 USD, 11.89 percent maximum drawdown, and 66.88 percent profitable trades" width={4800} height={2814} sizes="(max-width: 1200px) 94vw, 1140px" quality={100}/></button><details className="report-context"><summary><Info size={15}/>About this data & its limitations<span>Read context</span></summary><dl><div><dt>Source</dt><dd>{data.source}</dd></div><div><dt>Period</dt><dd>{data.period}</dd></div><div><dt>Platform</dt><dd>{data.platform}</dd></div><div><dt>Status</dt><dd>{data.statusNote}</dd></div></dl><p>Results are not independently audited. Costs, market conditions, and trading settings can affect outcomes. Historical performance does not guarantee future results.</p></details></>
    </div><p className="section-footnote"><Info size={14}/>Historical results do not guarantee future performance. Trading involves risk.</p><PerformanceNotes/><AccessCTA/></div>{expanded && data && <Modal label="Agent Jin historical performance report" onClose={() => setExpanded(false)}><Image src={data.image} alt="Original supplied Agent Jin 1.1 admin historical performance report" width={4800} height={2814} sizes="96vw" quality={100}/><p>AGENT JIN 1.1 · Supplied historical report · Not a v3 report</p></Modal>}</section>;
}
