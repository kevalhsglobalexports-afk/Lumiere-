
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  ingredients: string[];
  image: string; // This remains the 'Main' thumbnail
  images?: string[]; // Full gallery
  video?: string; // Optional motion ritual
  rating: number;
  reviews: number;
  stock?: number;
  sku?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'resolved';
}

export interface UserStored {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  joinDate?: string;
  orders?: number;
  totalSpent?: number;
}

export interface AdminProfile {
  name: string;
  email: string;
  phone: string;
  bio?: string;
  avatar?: string;
  role?: string;
}

export interface RitualVideo {
  url: string;
  title: string;
  description: string;
  poster?: string;
}

export interface BrandSettings {
  announcement: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  date: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
}
