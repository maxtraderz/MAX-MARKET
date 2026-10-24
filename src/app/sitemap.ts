import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site-config';
import { products } from '@/data/products';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap { return ['', '/contact/', '/legal/risk/', '/legal/privacy/', '/legal/terms/', ...products.map(p=>'/products/'+p.slug+'/')].map(path=>({url:siteConfig.url+path,changeFrequency:'monthly',priority:path===''?1:0.7})); }
