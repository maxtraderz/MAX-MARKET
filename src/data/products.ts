import type { Product } from '@/types';
export const products: Product[] = [
  {
    slug: 'agent-jin', name: 'Agent Jin V1', label: 'The signature system', version: '1',
    description: 'Explore Agent Jin V1, the supplied historical report, and the buy and sell demonstrations. Confirm its specification and execution platform before purchase.',
    color: '#1369f4', image: '/images/products/agent-jin-v1.svg',
    platform: null, features: ['Historical v1.1 report available', 'Buy and sell demonstrations', 'Direct contact through Telegram'],
    price: 649, originalPrice: 800, discountPercent: 18.875, currency: 'USD', license: null,
    checkoutUrl: null, demoVideo: '/videos/agent-jin-promo.mp4', demoPoster: '/images/demos/agent-jin-promo-poster.jpg',
  },
  {
    slug: 'jinx-orb-scalper-v2', name: 'JinX ORB Scalper V2', label: 'The ORB scalper', version: '2',
    description: 'Explore JinX ORB Scalper V2. Contact jinxlab to confirm its platform, settings, installation, and license details before purchase.',
    color: '#1369f4', image: '/images/products/jinx-orb-scalper-v2.svg',
    platform: null, features: ['Version 2', 'Confirm platform and settings', 'Direct contact through Telegram'],
    price: 599, originalPrice: 800, discountPercent: 25, currency: 'USD', license: null,
    checkoutUrl: null, demoVideo: null, demoPoster: null,
  },
];
export const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
