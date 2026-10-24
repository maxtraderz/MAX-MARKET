import type { Metadata, Viewport } from 'next';
import { Header, Footer } from '@/components/layout';
import { siteConfig } from '@/data/site-config';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {default: 'jinxlab — Precision in Trading Automation',template:'%s | jinxlab'},
  description: siteConfig.description,
  openGraph: {type:'website',siteName:siteConfig.name,title:'jinxlab — Automate with Precision',description:siteConfig.description,images:[{url:'/images/og-cover.png',width:1200,height:630,alt:'jinxlab trading automation collection'}]},
  icons: { icon: '/favicon.svg' },
  twitter: {card:'summary_large_image',title:'jinxlab',description:siteConfig.description,images:['/images/og-cover.png']},
};
export const viewport: Viewport = {themeColor:'#ffffff'};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body><a href="#main-content" className="skip-link">Skip to content</a><Header/><main id="main-content">{children}</main><Footer/></body></html>;
}
