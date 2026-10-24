'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
export function VideoPlayer({ src, poster, label, hero = false }: { src: string; poster: string; label: string; hero?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduced) { video.pause(); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.15 });
    observer.observe(video);
    return () => observer.disconnect();
  }, [src, reduced]);
  return <div className={'reference-video ' + (hero ? 'hero-video' : '')}>
    {failed ? <div className="video-error"><p>This video could not be loaded.</p><a href={src}>Open the demonstration video</a></div> :
      <><video ref={ref} src={src} poster={poster} aria-label={label} controls playsInline muted={muted} loop autoPlay={reduced === false}
        preload={hero ? 'auto' : 'metadata'} onVolumeChange={event => setMuted(event.currentTarget.muted)}
        onError={() => setFailed(true)}>Your browser does not support video playback. <a href={src}>Open video</a></video>
        <button className="sound-toggle" onClick={() => { const video = ref.current; if (!video) return; video.muted = !video.muted; setMuted(video.muted); video.play().catch(() => {}); }}>
          {muted ? <Volume2 size={14}/> : <VolumeX size={14}/>} {muted ? 'Play with sound' : 'Mute sound'}
        </button></>}
  </div>;
}
