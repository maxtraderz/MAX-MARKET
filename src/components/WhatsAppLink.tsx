import { siteConfig } from '@/data/site-config';

export function WhatsAppLink({ className }: { className?: string }) {
  return (
    <a
      className={className}
      href={siteConfig.socials.WhatsApp}
      target="_blank"
      rel="noopener noreferrer"
    >
      WhatsApp
    </a>
  );
}
