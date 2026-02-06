
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Glow Essence Serum',
    category: 'Serum',
    price: 64, // Base price in USD
    description: 'A vitamin-rich concentrate that restores natural luminescence and deeply hydrates with alpine rose stem cells.',
    ingredients: ['Vitamin C', 'Hyaluronic Acid', 'Rose Extract', 'Squalane'],
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviews: 1240
  },
  {
    id: '2',
    name: 'Silk Mane Hair Oil',
    category: 'Hair Care',
    price: 48,
    description: 'A transformative blend of cold-pressed oils that seals cuticles and adds a mirror-like shine to every strand.',
    ingredients: ['Argan Oil', 'Camellia Seed', 'Vitamin E', 'Sandalwood'],
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 892
  },
  {
    id: '3',
    name: 'Cloud Cleansing Foam',
    category: 'Facewash',
    price: 32,
    description: 'A marshmallow-soft foam that lifts impurities without disrupting the delicate moisture barrier.',
    ingredients: ['Aloe Vera', 'Green Tea', 'Glycerin', 'Amino Acids'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviews: 2105
  },
  {
    id: '4',
    name: 'Botanical Repair Shampoo',
    category: 'Shampoo',
    price: 38,
    description: 'Gently cleanses while infusing hair with plant proteins to strengthen from root to tip.',
    ingredients: ['Pea Protein', 'Bamboo Extract', 'Panthenol', 'Lavender'],
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviews: 3421
  },
  {
    id: '5',
    name: 'Midnight Dew Serum',
    category: 'Serum',
    price: 72,
    description: 'Intense overnight repair serum that works with your circadian rhythm to smooth fine lines and restore texture.',
    ingredients: ['Retinol', 'Peptides', 'Niacidamide', 'Ceramides'],
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    reviews: 678
  },
  {
    id: '6',
    name: 'Rose Gold Shimmer Oil',
    category: 'Body Care',
    price: 55,
    description: 'Dry body oil infused with gold mica to provide a sun-kissed glow and deep nourishment.',
    ingredients: ['Coconut Oil', 'Mica', 'Gold Flakes', 'Rosehip Oil'],
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 1560
  }
];

export const CATEGORIES = ['All', 'Serum', 'Hair Care', 'Facewash', 'Shampoo', 'Body Care'];

export interface CurrencyConfig {
  code: string;
  symbol: string;
  rate: number;
}

export const CURRENCY_MAP: Record<string, CurrencyConfig> = {
  "United States": { code: "USD", symbol: "$", rate: 1 },
  "Canada": { code: "CAD", symbol: "C$", rate: 1.36 },
  "United Kingdom": { code: "GBP", symbol: "£", rate: 0.79 },
  "France": { code: "EUR", symbol: "€", rate: 0.92 },
  "Germany": { code: "EUR", symbol: "€", rate: 0.92 },
  "India": { code: "INR", symbol: "₹", rate: 83.45 },
  "Australia": { code: "AUD", symbol: "A$", rate: 1.52 },
  "Japan": { code: "JPY", symbol: "¥", rate: 156.80 },
  "Singapore": { code: "SGD", symbol: "S$", rate: 1.35 },
  "United Arab Emirates": { code: "AED", symbol: "د.إ", rate: 3.67 },
  "Brazil": { code: "BRL", symbol: "R$", rate: 5.15 },
  "Italy": { code: "EUR", symbol: "€", rate: 0.92 }
};

export const COUNTRIES = Object.keys(CURRENCY_MAP);

export const STATES_BY_COUNTRY: Record<string, string[]> = {
  "United States": ["California", "New York", "Texas", "Florida", "Washington", "Illinois", "Georgia", "Ohio", "Michigan", "Arizona"],
  "Canada": ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Nova Scotia"],
  "India": ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Uttar Pradesh", "West Bengal", "Rajasthan"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  "France": ["Île-de-France", "Provence-Alpes-Côte d'Azur", "Nouvelle-Aquitaine", "Occitanie", "Auvergne-Rhône-Alpes"],
  "Germany": ["Bavaria", "Berlin", "Hamburg", "North Rhine-Westphalia", "Hesse"],
  "Australia": ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia"],
  "Brazil": ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia", "Paraná"]
};

export const CITIES_BY_STATE: Record<string, string[]> = {
  "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Beverly Hills", "Palo Alto", "Santa Monica", "Malibu"],
  "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "Brooklyn", "Queens", "Manhattan"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Navi Mumbai"],
  "Delhi": ["New Delhi", "Old Delhi", "Dwarka", "Saket", "Rohini", "Connaught Place", "Vasant Kunj"],
  "England": ["London", "Manchester", "Birmingham", "Liverpool", "Bristol", "Leeds", "Sheffield", "Oxford", "Cambridge"],
  "Île-de-France": ["Paris", "Boulogne-Billancourt", "Saint-Denis", "Argenteuil", "Montreuil", "Versailles"]
};

export const POSTAL_CODES_BY_CITY: Record<string, string[]> = {
  "Los Angeles": ["90001", "90002", "90003", "90004", "90005"],
  "Beverly Hills": ["90210", "90211", "90212"],
  "Mumbai": ["400001", "400002", "400003"],
  "New Delhi": ["110001", "110002", "110003"],
  "London": ["EC1A", "W1A", "SW1A", "E1 6AN"],
  "Paris": ["75001", "75002", "75003"]
};
