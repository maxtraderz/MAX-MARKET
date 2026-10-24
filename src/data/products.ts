import type { Product } from '@/types';
export const products: Product[] = [
  {
    slug: 'agent-jin', name: 'AGENT JIN', label: 'The signature system', version: '3',
    description: 'Our signature trading automation system. Explore the supplied historical report, then confirm the v3 specification and execution platform before purchase.',
    color: '#1369f4', image: '/images/demos/buy-poster.jpg',
    platform: null, features: ['v3 product release', 'Historical v1.1 report available', 'Product configuration to be confirmed'],
    price: 649, originalPrice: 800, discountPercent: 18.875, currency: 'USD', license: null,
    checkoutUrl: null, demoVideo: '/videos/agent-jin-promo.mp4', demoPoster: '/images/demos/agent-jin-promo-poster.jpg',
  },
];
export const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
