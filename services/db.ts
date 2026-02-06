
import { Product, Inquiry, UserStored, Order, AdminProfile, RitualVideo, BrandSettings } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES } from '../constants';

const DB_KEY = 'lumiere_essence_products';
const MSG_KEY = 'lumiere_essence_inquiries';
const USER_KEY = 'lumiere_essence_users';
const ORDER_KEY = 'lumiere_essence_orders';
const ADMIN_PROFILE_KEY = 'lumiere_essence_admin_profile';
const RITUAL_VIDEO_KEY = 'lumiere_essence_ritual_video';
const CATEGORY_KEY = 'lumiere_essence_categories';
const BRAND_SETTINGS_KEY = 'lumiere_essence_brand_settings';

export const dbService = {
  // --- Product Methods ---
  getProducts: (): Product[] => {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts: (products: Product[]): void => {
    localStorage.setItem(DB_KEY, JSON.stringify(products));
  },

  // --- Category Methods ---
  getCategories: (): string[] => {
    const data = localStorage.getItem(CATEGORY_KEY);
    if (!data) {
      localStorage.setItem(CATEGORY_KEY, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(data);
  },

  saveCategories: (categories: string[]): void => {
    localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
  },

  // --- Inquiry Methods ---
  getInquiries: (): Inquiry[] => {
    const data = localStorage.getItem(MSG_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveInquiries: (inquiries: Inquiry[]): void => {
    localStorage.setItem(MSG_KEY, JSON.stringify(inquiries));
  },

  addInquiry: (inquiry: Inquiry): void => {
    const inquiries = dbService.getInquiries();
    const updated = [inquiry, ...inquiries];
    dbService.saveInquiries(updated);
  },

  deleteInquiry: (id: string): void => {
    const inquiries = dbService.getInquiries();
    const updated = inquiries.filter(i => i.id !== id);
    dbService.saveInquiries(updated);
  },

  // --- User Persistence ---
  getUsers: (): UserStored[] => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: UserStored): void => {
    const users = dbService.getUsers();
    const filtered = users.filter(u => u.email.toLowerCase() !== user.email.toLowerCase());
    localStorage.setItem(USER_KEY, JSON.stringify([...filtered, user]));
  },

  // --- Order Persistence ---
  getOrders: (): Order[] => {
    const data = localStorage.getItem(ORDER_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveOrder: (order: Order): void => {
    const orders = dbService.getOrders();
    localStorage.setItem(ORDER_KEY, JSON.stringify([order, ...orders]));
  },

  updateOrderStatus: (id: string, status: Order['status']): void => {
    const orders = dbService.getOrders();
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    localStorage.setItem(ORDER_KEY, JSON.stringify(updated));
  },

  // --- Admin Profile ---
  getAdminProfile: (): AdminProfile => {
    const data = localStorage.getItem(ADMIN_PROFILE_KEY);
    if (data) return JSON.parse(data);
    return {
      name: 'Maison Oracle',
      email: 'admin@lumiere.com',
      phone: '+1 (888) LUMIÈRE',
      role: 'Head Alchemist',
      bio: 'Curating botanical luxury since the first bloom.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
    };
  },

  saveAdminProfile: (profile: AdminProfile): void => {
    localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(profile));
  },

  // --- Ritual Video ---
  getRitualVideo: (): RitualVideo => {
    const data = localStorage.getItem(RITUAL_VIDEO_KEY);
    if (data) return JSON.parse(data);
    return {
      url: 'https://www.youtube.com/embed/zO_8720qB14?autoplay=1&mute=1&loop=1',
      title: 'The Synthesis Ritual',
      description: 'A visual journey through our Provencal harvest and the science behind every bottle.'
    };
  },

  saveRitualVideo: (video: RitualVideo): void => {
    localStorage.setItem(RITUAL_VIDEO_KEY, JSON.stringify(video));
  },

  // --- Brand Settings ---
  getBrandSettings: (): BrandSettings => {
    const data = localStorage.getItem(BRAND_SETTINGS_KEY);
    if (data) return JSON.parse(data);
    return {
      announcement: 'Complimentary Alpine Rose Mist with orders over $150',
      heroTitle: 'Breathe Life Into Skin',
      heroSubtitle: 'The intersection of molecular precision and ancient botanical wisdom.'
    };
  },

  saveBrandSettings: (settings: BrandSettings): void => {
    localStorage.setItem(BRAND_SETTINGS_KEY, JSON.stringify(settings));
  }
};
