import type { Product } from '@/types';
export const products: Product[] = [
  {
    slug: 'agent-jin', name: 'Agent Jin V1', label: 'The signature system', version: '1',
    description: 'Explore Agent Jin V1, the supplied historical report, and the buy and sell demonstrations. Confirm its specification and execution platform before purchase.',
    color: '#1369f4', image: '/images/products/agent-jin-v1.svg',
    platform: null, features: ['Historical report available', 'Buy and sell demonstrations', 'Support on Telegram and WhatsApp'],
    price: 300, originalPrice: 800, discountPercent: 62.5, currency: 'USD', license: null,
    checkoutUrl: null, demoVideo: '/videos/agent-jin-promo-new-audio.mp4', demoPoster: '/images/demos/agent-jin-promo-new-poster.jpg',
  },
  {
    slug: 'jinx-orb-scalper-v2', name: 'JinX ORB Scalper V2', label: 'The ORB scalper', version: '2',
    description: 'Explore JinX ORB Scalper V2. Contact jinxlab to confirm its platform, settings, installation, and license details before purchase.',
    color: '#1369f4', image: '/images/products/jinx-orb-scalper-v2.svg',
    platform: null, features: ['Version 2', 'Confirm platform and settings', 'Support on Telegram and WhatsApp'],
    price: 300, originalPrice: 800, discountPercent: 62.5, currency: 'USD', license: null,
    checkoutUrl: null, demoVideo: null, demoPoster: null,
  },
  {
    slug: 'jinx-zoro', name: 'JinX Zoro', label: 'The Zoro system', version: null,
    description: 'Explore JinX Zoro. Contact jinxlab to confirm its platform, settings, installation, and license details before purchase.',
    color: '#1369f4', image: '/images/products/jinx-zoro.svg',
    platform: null, features: ['Confirm platform and settings', 'Installation details on request', 'Support on Telegram and WhatsApp'],
    price: 300, originalPrice: 800, discountPercent: 62.5, currency: 'USD', license: null,
    checkoutUrl: null, demoVideo: null, demoPoster: null,
  },
];
export const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export const bundleOffer = { price: 600, originalPrice: 2400, discountPercent: 75, savings: 1800 };
