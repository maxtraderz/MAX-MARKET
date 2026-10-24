export const siteConfig = {
  name: 'jinxlab',
  url: 'https://jinzfx-market.paletiger16.chatgpt.site',
  description: 'Explore premium trading automation systems, historical performance data, and an anonymous certificate gallery.',
  contact: { email: 'jinzfx7@gmail.com' as string | null, url: 'https://t.me/jinzfx' as string | null },
  socials: { Telegram: 'https://t.me/jinzfx' as string | null, WhatsApp: null as string | null, Instagram: null as string | null },
  risk: 'Trading financial markets involves substantial risk and may result in financial loss. Automated trading systems do not guarantee profits. Historical results and backtests are not reliable indicators of future performance.',
};
export const supportHref = siteConfig.contact.url || (siteConfig.contact.email ? 'mailto:' + siteConfig.contact.email : '/contact/');

export const orbAccessMessage = "Hi, I'd like access to ORB.";
const accessUrl = new URL(siteConfig.contact.url || 'https://t.me/jinzfx');
accessUrl.searchParams.set('text', orbAccessMessage);
export const orbAccessHref = accessUrl.toString();
