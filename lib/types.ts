/* ── Categories ── */

export interface Category {
  id: number;
  slug: string;
  name: string;
  label: string;
}

/* ── Products ── */

export interface Product {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  original_price: number;
  category_id: number;
  description: string;
  features: string[];
  color: string;
  accent_color: string;
  sold_out: boolean;
  image: string | null;
  is_upsell: boolean;
  created_at: string;
}

/* ── Reviews ── */

export interface Review {
  id: number;
  product_id: number;
  author_name: string;
  rating: number;
  body: string;
  verified: boolean;
  created_at: string;
}

/* ── Orders ── */

export interface Order {
  id: number;
  product_id: number | null;
  product: string;
  phone: string;
  email: string | null;
  created_at: string;
  upsell: boolean;
  ip: string | null;
  first_name: string | null;
  last_name: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  shipping_notes: string | null;
  selected_size: string | null;
  selected_color: string | null;
}

/* ── Shop Config ── */

export interface ShopConfig {
  key: string;
  value: string;
}
