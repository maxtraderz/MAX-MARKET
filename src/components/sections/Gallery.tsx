'use client';
import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw, Activity } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { SectionHeading } from '@/components/ui';
const minuteCandles = Array.from({ length: 3840 }, (_, i) => {
  const open = 190 + i * .012 + Math.sin(i * .022) * 7 + Math.sin(i * .15) * 2;
  const close = open + Math.sin(i * 1.7 + .4) * 1.5;
  return { open, close, high: Math.max(open, close) + .6, low: Math.min(open, close) - .6 };
});
const intervals: Record<string, number> = { '1m': 1, '5m': 5, '15m': 15, '1hr': 60 };
const windows: Record<string, number> = { '1m': 24, '5m': 40, '15m': 52, '1hr': 64 };
export function MarketChart() {
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(48);
  const [timeframe, setTimeframe] = useState('5m');
  const [zoom, setZoom] = useState(40);
  const [timeZoom, setTimeZoom] = useState(100);
  const [priceZoom, setPriceZoom] = useState(100);
  const [hovered, setHovered] = useState<number | null>(null);
  useEffect(() => {
    if (!playing || reduced) return;
    const timer = setInterval(() => { if (document.visibilityState === 'visible') setVisible(n => n >= 64 ? 36 : n + 1); }, 1600);
    return () => clearInterval(timer);
  }, [playing, reduced]);
  useEffect(() => {
    const target = windows[timeframe];
    if (reduced) { setZoom(target); return; }
    const from = zoom;
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / 480);
      setZoom(from + (target - from) * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // Continue an interrupted zoom from its current position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe, reduced]);
  const step = intervals[timeframe];
  const candles = useMemo(() => Array.from({ length: 64 }, (_, i) => {
    const chunk = minuteCandles.slice(3840 - 64 * step + i * step, 3840 - 64 * step + (i + 1) * step);
    return { open: chunk[0].open, close: chunk[chunk.length - 1].close, high: Math.max(...chunk.map(c => c.high)), low: Math.min(...chunk.map(c => c.low)) };
  }), [step]);
  const visibleWindow = zoom / (timeZoom / 100);
  const start = Math.max(0, visible - visibleWindow);
  const spacing = 800 / visibleWindow;
  const x = (index: number) => 36 + (index - start) * spacing;
  const sample = candles.slice(Math.floor(start), visible);
  const dataLow = Math.min(...sample.map(c => c.low));
  const dataHigh = Math.max(...sample.map(c => c.high));
  const midpoint = (dataHigh + dataLow) / 2;
  const halfRange = ((dataHigh - dataLow) / 2 + 4) / (priceZoom / 100);
  const low = midpoint - halfRange;
  const high = midpoint + halfRange;
  const y = (value: number) => 354 - (value - low) / (high - low) * 300;
  const selected = hovered === null ? visible - 1 : Math.max(Math.ceil(start), Math.min(hovered, visible - 1));
  const candle = candles[selected];
  return <section className="section market-section" id="proof"><div className="container">
    <SectionHeading eyebrow="THE CHART EXPERIENCE" title="A clearer view of" blue="the market"/>
    <div className="market-panel">
      <div className="market-toolbar"><div className="market-symbol"><span className="market-icon"><Activity size={20}/></span><div><strong>Jinx ORB</strong><span>Illustrative market · USD</span></div></div><span className="market-demo-badge">SIMULATED DATA</span></div>
      <div className="market-controls"><div className="market-timeframes" role="group" aria-label="Chart timeframe">{['1m','5m','15m','1hr'].map(item => <button key={item} aria-pressed={timeframe === item} onClick={() => { setTimeframe(item); setHovered(null); }}>{item}</button>)}</div><div className="market-replay"><button aria-label="Reset chart replay" onClick={() => { setVisible(36); setHovered(null); }}><RotateCcw size={14}/></button><button aria-label={playing ? 'Pause chart replay' : 'Play chart replay'} aria-pressed={playing} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={14}/> : <Play size={14}/>}<span>Replay</span></button></div></div>
      <div className="market-readout"><span>{timeframe} candles</span><span>O <b>{candle.open.toFixed(2)}</b></span><span>H <b>{candle.high.toFixed(2)}</b></span><span>L <b>{candle.low.toFixed(2)}</b></span><span>C <b>{candle.close.toFixed(2)}</b></span></div>
      <div className="market-plot">
      <svg className="market-canvas" viewBox="0 0 960 440" role="img" aria-label="Jinx ORB candlestick chart with simulated prices." onPointerMove={event => { const bounds=event.currentTarget.getBoundingClientRect(); setHovered(Math.max(0,Math.min(63,Math.round((((event.clientX-bounds.left)/bounds.width*960-36)/spacing)+start)))); }} onPointerLeave={() => setHovered(null)}>
        <defs><clipPath id="market-plot-clip"><rect x="24" y="24" width="838" height="368"/></clipPath><clipPath id="market-price-clip"><rect x="24" y="24" width="838" height="330"/></clipPath><linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#438cff" stopOpacity=".09"/><stop offset="1" stopColor="#438cff" stopOpacity="0"/></linearGradient></defs>
        {Array.from({length:5},(_,i)=>low+(high-low)*i/4).map(value => <g key={value}><line x1="24" x2="862" y1={y(value)} y2={y(value)} stroke="#e8eef8"/><text x="878" y={y(value)+4} fill="#8a99b1" fontSize="11">{value.toFixed(2)}</text></g>)}
        {[0,1,2,3,4,5,6].map(i => <g key={i}><line x1={40+i*130} x2={40+i*130} y1="24" y2="366" stroke="#f0f4fa"/><text x={40+i*130} y="420" fill="#8a99b1" fontSize="11">{(() => { const minutes=Math.round((start+i*visibleWindow/6)*step); return Math.floor(minutes/60)+':'+String(minutes%60).padStart(2,'0'); })()}</text></g>)}
        <g clipPath="url(#market-plot-clip)">
        <path clipPath="url(#market-price-clip)" d={'M36 366 '+candles.slice(0,visible).map((c,i)=>'L'+(x(i))+' '+y(c.close)).join(' ')+' L'+(x(visible-1))+' 366 Z'} fill="url(#chart-area)"/>
        {candles.slice(0,visible).map((c,i)=><g key={i} className="market-candle" style={{animationDelay:(i%6)*35+'ms'}}><g clipPath="url(#market-price-clip)"><line x1={x(i)} x2={x(i)} y1={y(c.high)} y2={y(c.low)} stroke={c.close>=c.open?'#4487ee':'#9aa9bd'}/><rect x={x(i)-Math.max(3,spacing*.62)/2} y={y(Math.max(c.open,c.close))} width={Math.max(3,spacing*.62)} height={Math.max(2,Math.abs(y(c.open)-y(c.close)))} rx="1" fill={c.close>=c.open?'#4487ee':'#9aa9bd'}/></g><rect x={x(i)-Math.max(3,spacing*.62)/2} y={380-(12+i%7*3)} width={Math.max(3,spacing*.62)} height={12+i%7*3} fill={c.close>=c.open?'#4487ee':'#9aa9bd'} opacity=".15"/></g>)}
        {hovered!==null&&<g><line x1={x(selected)} x2={x(selected)} y1="24" y2="390" stroke="#98a9c2" strokeDasharray="3 4"/><circle clipPath="url(#market-price-clip)" cx={x(selected)} cy={y(candle.close)} r="4" fill="#438cff" stroke="white" strokeWidth="2"/></g>}
        </g>
      </svg>
      <label className="market-zoom market-zoom-price">
        <span>Price</span>
        <span aria-hidden="true">+</span>
        <input
          type="range"
          aria-label="Price zoom"
          aria-orientation="vertical"
          aria-valuetext={priceZoom + '%'}
          min={50}
          max={200}
          step={5}
          value={priceZoom}
          onChange={event => setPriceZoom(event.currentTarget.valueAsNumber)}
        />
        <span aria-hidden="true">−</span>
      </label>
      <label className="market-zoom market-zoom-time">
        <span>Time</span>
        <span aria-hidden="true">−</span>
        <input
          type="range"
          aria-label="Time zoom"
          aria-valuetext={timeZoom + '%'}
          min={50}
          max={200}
          step={5}
          value={timeZoom}
          onChange={event => setTimeZoom(event.currentTarget.valueAsNumber)}
        />
        <span aria-hidden="true">+</span>
      </label>
      </div>
    </div>
  </div></section>;
}
