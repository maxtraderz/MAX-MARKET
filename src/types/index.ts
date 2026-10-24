export type Product = {
  slug: string; name: string; label: string; version: string | null;
  description: string; color: string; image: string;
  platform: string | null; features: string[];
  price: number | null; originalPrice?: number; discountPercent?: number;
  currency: string; license: string | null; checkoutUrl: string | null;
  demoVideo: string | null; demoPoster: string | null;
};
export type Review = { id: string; displayName: string; date?: string; text: string; rating?: number; product?: string };
