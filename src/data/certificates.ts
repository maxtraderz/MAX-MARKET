export const certificates = Array.from({ length: 9 }, (_, i) => i === 8 ? {
  id: 9,
  src: '/images/products/agent-jin-banner-animated.svg',
  alt: 'Agent Jin V1 product banner: A system for your next chapter, with blue product box artwork',
  type: 'Product showcase',
  issuer: 'Agent Jin V1',
} : ({
  id: i + 1,
  src: '/images/certificates/proof-' + String(i + 1).padStart(2, '0') + '.webp',
  alt: 'Supplied ' + ([6, 7].includes(i) ? 'funded account certificate' : 'payout certificate') + ' ' + String(i + 1).padStart(2, '0') + ', recipient details permanently removed',
  type: [6, 7].includes(i) ? 'Funded account' : 'Payout record',
  issuer: [0, 8].includes(i) ? 'Apex Trader Funding' : 'Lucid Trading',
}));
