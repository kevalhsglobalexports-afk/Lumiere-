
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Package, 
  Users, 
  TrendingUp, 
  Settings, 
  Save, 
  Video, 
  MessageSquare, 
  X, 
  Plus,
  Trash2,
  Tag,
  DollarSign,
  Upload,
  Film,
  ArrowLeft,
  ArrowRight,
  Star,
  Edit3,
  Layers,
  CheckCircle2,
  LayoutGrid,
  ShoppingBag,
  User as UserIcon,
  Phone,
  Mail,
  Camera,
  Info,
  ExternalLink,
  ShieldCheck,
  Search,
  Truck,
  AlertCircle,
  // Added Clock to fix the missing import error
  Clock
} from 'lucide-react';
import { Product, Inquiry, UserStored, Order, AdminProfile, RitualVideo, BrandSettings } from '../types';
import { dbService } from '../services/db';

interface AdminProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const Admin: React.FC<AdminProps> = ({ products, onAddProduct, onDeleteProduct }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'categories' | 'orders' | 'customers' | 'media' | 'profile'>('analytics');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [users, setUsers] = useState<UserStored[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<string[]>(dbService.getCategories());
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(dbService.getAdminProfile());
  const [brandMedia, setBrandMedia] = useState<RitualVideo>(dbService.getRitualVideo());
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(dbService.getBrandSettings());
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newCategoryInForm, setNewCategoryInForm] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: 0,
    description: '',
    images: [] as string[],
    video: '',
    ingredients: '',
    stock: 100,
  });

  useEffect(() => {
    setInquiries(dbService.getInquiries());
    setUsers(dbService.getUsers());
    setOrders(dbService.getOrders());
    setCategories(dbService.getCategories());
  }, [activeTab]);

  const generateSKU = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `LUM-${segment()}-${segment()}`;
  };

  const stats = [
    { label: 'Revenue', value: `$${orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0).toLocaleString()}`, growth: '+12.5%', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Seekers', value: `${users.length}`, growth: '+15.3%', icon: Users, color: 'text-blue-500' },
    { label: 'Orders', value: `${orders.length}`, growth: 'Live', icon: ShoppingBag, color: 'text-purple-500' },
    { label: 'Consults', value: `${inquiries.length}`, growth: 'New', icon: MessageSquare, color: 'text-amber-500' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // FIX: Explicitly type 'file' as File to ensure it's compatible with FileReader.readAsDataURL and avoid 'unknown' type errors
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductForm(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Added startEdit function to handle product editing logic
  const startEdit = (p: Product) => {
    setProductForm({
      name: p.name,
      category: p.category,
      price: p.price,
      description: p.description,
      images: p.images || [p.image],
      video: p.video || '',
      ingredients: p.ingredients.join(', '),
      stock: p.stock || 0,
    });
    setIsEditing(p.id);
    setShowAddProduct(true);
    // Smooth scroll to the form
    const container = document.querySelector('main');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleManifestRitual = (e: React.FormEvent) => {
    e.preventDefault();
    let finalCategory = productForm.category;

    if (isAddingNewCategory && newCategoryInForm) {
      if (!categories.includes(newCategoryInForm)) {
        const updatedCats = [...categories, newCategoryInForm];
        setCategories(updatedCats);
        dbService.saveCategories(updatedCats);
      }
      finalCategory = newCategoryInForm;
    }

    if (productForm.images.length === 0) {
      alert("Please upload at least one image essence.");
      return;
    }

    if (isEditing) {
      const updatedProducts = products.map(p => {
        if (p.id === isEditing) {
          return {
            ...p,
            name: productForm.name,
            category: finalCategory,
            price: productForm.price,
            description: productForm.description,
            image: productForm.images[0],
            images: productForm.images,
            video: productForm.video,
            ingredients: productForm.ingredients.split(',').map(i => i.trim()).filter(i => i !== ''),
            stock: productForm.stock,
          };
        }
        return p;
      });
      dbService.saveProducts(updatedProducts);
      window.location.reload(); 
    } else {
      const productToAdd: Product = {
        id: Date.now().toString(),
        name: productForm.name,
        category: finalCategory,
        price: productForm.price,
        description: productForm.description,
        image: productForm.images[0],
        images: productForm.images,
        video: productForm.video,
        ingredients: productForm.ingredients.split(',').map(i => i.trim()).filter(i => i !== ''),
        rating: 5,
        reviews: 0,
        stock: productForm.stock,
        sku: generateSKU()
      };
      onAddProduct(productToAdd);
    }

    setShowAddProduct(false);
    setIsEditing(null);
    setIsAddingNewCategory(false);
    setNewCategoryInForm('');
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    dbService.updateOrderStatus(id, status);
    setOrders(dbService.getOrders());
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.saveAdminProfile(adminProfile);
    alert("Oracle Profile Harmonized.");
  };

  const handleMediaUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.saveRitualVideo(brandMedia);
    dbService.saveBrandSettings(brandSettings);
    alert("Brand Essence Updated.");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-white border-r border-stone-100 p-8 flex flex-col gap-12 h-screen sticky top-0 z-40">
        <h2 className="text-2xl font-serif font-bold tracking-tighter text-stone-900">LUMIÈRE ADMIN</h2>
        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          {[
            { id: 'analytics', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: 'Collection', icon: Package },
            { id: 'categories', label: 'Categories', icon: LayoutGrid },
            { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.filter(o => o.status === 'Pending').length },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'media', label: 'Brand Media', icon: Video },
            { id: 'profile', label: 'Oracle Settings', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all relative ${
                activeTab === item.id ? 'bg-stone-900 text-white shadow-xl' : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {!!item.badge && item.badge > 0 && <span className="absolute right-4 w-5 h-5 bg-amber-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse">{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="pt-8 border-t border-stone-50">
          <div className="flex items-center gap-4 px-4">
            <img src={adminProfile.avatar} className="w-10 h-10 rounded-full object-cover border border-stone-100 shadow-sm" alt="" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-stone-900 truncate">{adminProfile.name}</p>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest">{adminProfile.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-12 space-y-12 overflow-y-auto h-screen no-scrollbar bg-[#fafafa]">
        <AnimatePresence mode="wait">
          
          {/* 1. ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-6 group hover:shadow-lg transition-all">
                    <stat.icon className={`w-6 h-6 ${stat.color} group-hover:scale-110 transition-transform`} />
                    <div>
                      <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-serif mt-1">{stat.value}</h3>
                        <span className="text-[10px] font-bold text-emerald-500">{stat.growth}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-serif">Recent Rituals (Orders)</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-amber-600 text-[10px] font-bold uppercase tracking-widest border-b border-amber-200 pb-1">View All</button>
                  </div>
                  <div className="space-y-6">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="flex justify-between items-center p-5 bg-stone-50 rounded-3xl group">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                            {o.status === 'Delivered' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-stone-900">{o.customerName}</p>
                            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">{o.id} • {o.date.split(',')[0]}</p>
                          </div>
                        </div>
                        <p className="font-serif font-bold text-stone-900">${o.total}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm">
                   <h3 className="text-2xl font-serif mb-8">Best Sellers</h3>
                   <div className="space-y-8">
                     {products.slice(0, 4).map((p, i) => (
                       <div key={p.id} className="flex items-center gap-6">
                         <div className="text-stone-300 font-serif italic text-2xl w-6">0{i+1}</div>
                         <img src={p.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                         <div className="flex-1">
                           <p className="font-bold text-stone-900">{p.name}</p>
                           <div className="w-full bg-stone-50 h-1.5 rounded-full mt-2">
                             <div className="bg-amber-400 h-full rounded-full" style={{ width: `${80 - (i*15)}%` }} />
                           </div>
                         </div>
                         <p className="font-bold text-stone-400 text-xs">{(240 - (i*45))} Sold</p>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. PRODUCTS TAB */}
          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h2 className="text-3xl font-serif text-stone-900">Maison Collection</h2>
                  <p className="text-stone-400 text-sm font-light">Inventory management and ritual creation.</p>
                </div>
                <button 
                  onClick={() => {
                    setShowAddProduct(!showAddProduct);
                    if (isEditing) setIsEditing(null);
                  }}
                  className="bg-stone-900 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-amber-600 transition-all flex items-center gap-3"
                >
                  {showAddProduct ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {showAddProduct ? 'Cancel' : 'Add Ritual'}
                </button>
              </div>

              {showAddProduct && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                  <form onSubmit={handleManifestRitual} className="bg-white p-12 rounded-[3.5rem] border border-stone-100 shadow-xl space-y-10 mb-12">
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="space-y-2 col-span-1 md:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Ritual Name</label>
                        <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full px-6 py-4.5 rounded-2xl bg-stone-50 border border-stone-100 outline-none focus:ring-2 focus:ring-amber-100 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Category</label>
                        <div className="relative">
                          {!isAddingNewCategory ? (
                            <select 
                              value={productForm.category} 
                              onChange={e => {
                                if (e.target.value === 'ADD_NEW') {
                                  setIsAddingNewCategory(true);
                                } else {
                                  setProductForm({...productForm, category: e.target.value});
                                }
                              }} 
                              className="w-full px-6 py-4.5 rounded-2xl bg-stone-50 border border-stone-100 outline-none font-bold appearance-none"
                            >
                              <option value="" disabled>Select Category...</option>
                              {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                              <option value="ADD_NEW" className="text-amber-600 font-bold">+ Add New Category...</option>
                            </select>
                          ) : (
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                autoFocus
                                placeholder="New Category..." 
                                value={newCategoryInForm}
                                onChange={e => setNewCategoryInForm(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-amber-50 border border-amber-200 outline-none font-bold" 
                              />
                              <button type="button" onClick={() => setIsAddingNewCategory(false)} className="p-4 bg-stone-100 rounded-2xl"><X className="w-4 h-4" /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Price (USD)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                          <input type="number" required value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-stone-50 border border-stone-100 outline-none font-bold" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Stock Level</label>
                        <input type="number" required value={productForm.stock} onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})} className="w-full px-6 py-4.5 rounded-2xl bg-stone-50 border border-stone-100 outline-none font-bold" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Ritual Gallery</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
                        <AnimatePresence>
                          {productForm.images.map((img, idx) => (
                            <motion.div layout key={img} className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-stone-100">
                              <img src={img} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-stone-900/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                <button type="button" onClick={() => setProductForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== idx)}))} className="p-3 bg-red-600 rounded-full text-white"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        <button type="button" onClick={() => imageInputRef.current?.click()} className="aspect-square rounded-[2.5rem] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-2 text-stone-400 hover:border-amber-400 hover:text-amber-600 transition-all">
                          <Plus className="w-6 h-6" />
                          <span className="text-[8px] font-bold uppercase tracking-widest">Upload Photo</span>
                        </button>
                      </div>
                      <input type="file" ref={imageInputRef} multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Ingredients (Comma Separated)</label>
                      <textarea rows={2} value={productForm.ingredients} onChange={e => setProductForm({...productForm, ingredients: e.target.value})} className="w-full px-6 py-5 rounded-2xl bg-stone-50 border border-stone-100 outline-none resize-none focus:ring-2 focus:ring-amber-200" placeholder="Alpine Rose, Squalane..." />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Botanical Description</label>
                      <textarea required rows={4} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full px-6 py-5 rounded-2xl bg-stone-50 border border-stone-100 outline-none resize-none focus:ring-2 focus:ring-amber-200" placeholder="The essence of this ritual..." />
                    </div>

                    <button type="submit" className="w-full bg-stone-900 text-white py-6 rounded-full font-bold shadow-2xl hover:bg-amber-600 transition-all flex items-center justify-center gap-3">
                      {isEditing ? <Save className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                      {isEditing ? 'Harmonize Ritual' : 'Manifest Ritual'}
                    </button>
                  </form>
                </motion.div>
              )}

              <div className="bg-white rounded-[3rem] border border-stone-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-stone-50 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      <th className="p-8">Ritual</th>
                      <th className="p-8">Category</th>
                      <th className="p-8">Inventory</th>
                      <th className="p-8">Price</th>
                      <th className="p-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {products.map((p) => (
                      <tr key={p.id} className="group hover:bg-stone-50/50 transition-colors">
                        <td className="p-8">
                          <div className="flex items-center gap-6">
                            <img src={p.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt="" />
                            <div>
                              <p className="font-serif text-lg">{p.name}</p>
                              <p className="text-[9px] font-mono text-stone-400 mt-1 uppercase tracking-wider">{p.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-8"><span className="px-4 py-1 rounded-full bg-stone-100 text-[9px] font-bold uppercase tracking-widest text-stone-500">{p.category}</span></td>
                        <td className="p-8">
                           <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${p.stock && p.stock < 20 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                             <span className="text-sm font-bold text-stone-600">{p.stock || 0} in Vault</span>
                           </div>
                        </td>
                        <td className="p-8 font-serif font-bold text-stone-900">${p.price}</td>
                        <td className="p-8 text-right">
                          <div className="flex justify-end gap-3">
                            <button onClick={() => startEdit(p)} className="p-3 bg-white border border-stone-100 rounded-xl text-stone-400 hover:text-amber-600 transition-all"><Edit3 className="w-5 h-5" /></button>
                            <button onClick={() => onDeleteProduct(p.id)} className="p-3 bg-white border border-stone-100 rounded-xl text-red-300 hover:text-red-500 transition-all"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* 3. ORDERS TAB */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif">Maison Orders</h2>
                <div className="flex gap-4">
                   <div className="relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                     <input type="text" placeholder="Search orders..." className="pl-12 pr-6 py-3 bg-white border border-stone-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-amber-100" />
                   </div>
                </div>
              </div>

              <div className="bg-white rounded-[3.5rem] border border-stone-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-stone-50 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      <th className="p-8">Order Ritual</th>
                      <th className="p-8">Seeker</th>
                      <th className="p-8">Aura Status</th>
                      <th className="p-8">Value</th>
                      <th className="p-8 text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-stone-50/50">
                        <td className="p-8">
                           <p className="font-bold text-stone-900">{o.id}</p>
                           <p className="text-[10px] text-stone-400 uppercase tracking-widest">{o.date}</p>
                        </td>
                        <td className="p-8">
                           <p className="font-bold text-stone-900">{o.customerName}</p>
                           <p className="text-[10px] text-stone-400">{o.customerEmail}</p>
                        </td>
                        <td className="p-8">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                             o.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                             o.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                             o.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                             'bg-emerald-50 text-emerald-600'
                           }`}>
                             {o.status}
                           </span>
                        </td>
                        <td className="p-8 font-serif font-bold text-stone-900">${o.total}</td>
                        <td className="p-8 text-right">
                           <div className="flex justify-end gap-2">
                              {o.status === 'Pending' && <button onClick={() => updateOrderStatus(o.id, 'Shipped')} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"><Truck className="w-4 h-4" /></button>}
                              {o.status === 'Shipped' && <button onClick={() => updateOrderStatus(o.id, 'Delivered')} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"><CheckCircle2 className="w-4 h-4" /></button>}
                              <button onClick={() => updateOrderStatus(o.id, 'Cancelled')} className="p-2.5 bg-red-50 text-red-400 rounded-xl hover:bg-red-100 transition-colors"><X className="w-4 h-4" /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* 4. CUSTOMERS TAB */}
          {activeTab === 'customers' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
               <h2 className="text-3xl font-serif">Maison Seekers</h2>
               <div className="bg-white rounded-[3.5rem] border border-stone-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-stone-50 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      <th className="p-8">Seeker Profile</th>
                      <th className="p-8">Join Date</th>
                      <th className="p-8">Rituals</th>
                      <th className="p-8">Total Aura</th>
                      <th className="p-8 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {users.map((u, i) => (
                      <tr key={i} className="hover:bg-stone-50/50">
                        <td className="p-8">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 font-bold">{u.name.charAt(0)}</div>
                              <div>
                                <p className="font-bold text-stone-900">{u.name}</p>
                                <p className="text-[10px] text-stone-400">{u.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="p-8 text-stone-500 text-sm">{u.joinDate || 'Jan 12, 2024'}</td>
                        <td className="p-8 text-stone-600 font-bold text-sm">{u.orders || 0} Orders</td>
                        <td className="p-8 font-serif font-bold text-amber-700">${u.totalSpent || 0}</td>
                        <td className="p-8 text-right">
                           <button className="p-3 bg-white border border-stone-100 rounded-xl text-stone-400 hover:text-stone-900 transition-all"><Mail className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* 5. MEDIA TAB */}
          {activeTab === 'media' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-12 pb-20">
               <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-stone-900 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl">
                    <Video className="w-10 h-10" />
                  </div>
                  <h2 className="text-4xl font-serif">Brand Media & Settings</h2>
                  <p className="text-stone-400 font-light">Curate the digital essence of Lumière.</p>
               </div>

               <form onSubmit={handleMediaUpdate} className="bg-white p-12 rounded-[4rem] border border-stone-100 shadow-xl space-y-12">
                  <div className="space-y-8">
                     <h3 className="text-2xl font-serif border-b border-stone-50 pb-4">Cinematic Experience</h3>
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Ritual Video URL (YouTube/MP4)</label>
                           <input type="text" value={brandMedia.url} onChange={e => setBrandMedia({...brandMedia, url: e.target.value})} className="w-full px-6 py-4.5 rounded-2xl bg-stone-50 border border-stone-100 outline-none font-bold text-sm" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Video Title</label>
                           <input type="text" value={brandMedia.title} onChange={e => setBrandMedia({...brandMedia, title: e.target.value})} className="w-full px-6 py-4.5 rounded-2xl bg-stone-50 border border-stone-100 outline-none font-bold text-sm" />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Video Narrative</label>
                        <textarea rows={2} value={brandMedia.description} onChange={e => setBrandMedia({...brandMedia, description: e.target.value})} className="w-full px-6 py-5 rounded-2xl bg-stone-50 border border-stone-100 outline-none resize-none font-medium" />
                     </div>
                  </div>

                  <div className="space-y-8">
                     <h3 className="text-2xl font-serif border-b border-stone-50 pb-4">Storefront Announcements</h3>
                     <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Global Announcement Banner</label>
                        <input type="text" value={brandSettings.announcement} onChange={e => setBrandSettings({...brandSettings, announcement: e.target.value})} className="w-full px-6 py-4.5 rounded-2xl bg-amber-50 border border-amber-100 outline-none font-bold text-sm text-amber-900" />
                     </div>
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Hero Ritual Title</label>
                           <input type="text" value={brandSettings.heroTitle} onChange={e => setBrandSettings({...brandSettings, heroTitle: e.target.value})} className="w-full px-6 py-4.5 rounded-2xl bg-stone-50 border border-stone-100 outline-none font-bold text-sm" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Hero Ritual Subtitle</label>
                           <input type="text" value={brandSettings.heroSubtitle} onChange={e => setBrandSettings({...brandSettings, heroSubtitle: e.target.value})} className="w-full px-6 py-4.5 rounded-2xl bg-stone-50 border border-stone-100 outline-none font-bold text-sm" />
                        </div>
                     </div>
                  </div>

                  <button type="submit" className="w-full bg-stone-900 text-white py-6 rounded-full font-bold shadow-2xl hover:bg-amber-600 transition-all flex items-center justify-center gap-3">
                    <Save className="w-5 h-5" /> Harmonize Brand Essence
                  </button>
               </form>
            </motion.div>
          )}

          {/* 6. PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-12">
               <div className="text-center space-y-4">
                  <div className="relative inline-block group">
                    <img src={adminProfile.avatar} className="w-32 h-32 rounded-[3.5rem] object-cover border-4 border-white shadow-2xl group-hover:opacity-80 transition-opacity" alt="" />
                    <button onClick={() => profileImageRef.current?.click()} className="absolute bottom-2 right-2 p-3 bg-amber-500 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform"><Camera className="w-5 h-5" /></button>
                    <input type="file" ref={profileImageRef} hidden accept="image/*" onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setAdminProfile({...adminProfile, avatar: reader.result as string});
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </div>
                  <h2 className="text-4xl font-serif">{adminProfile.name}</h2>
                  <p className="text-stone-400 font-light uppercase tracking-widest text-xs">{adminProfile.role}</p>
               </div>

               <form onSubmit={handleProfileUpdate} className="bg-white p-12 rounded-[4rem] border border-stone-100 shadow-xl space-y-10">
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Oracle Identity</label>
                        <div className="relative">
                           <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                           <input type="text" value={adminProfile.name} onChange={e => setAdminProfile({...adminProfile, name: e.target.value})} className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-stone-50 border border-stone-100 outline-none font-bold" />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Sanctuary Role</label>
                        <input type="text" value={adminProfile.role} onChange={e => setAdminProfile({...adminProfile, role: e.target.value})} className="w-full px-6 py-4.5 rounded-2xl bg-stone-50 border border-stone-100 outline-none font-bold" />
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Communication Portal (Email)</label>
                        <div className="relative">
                           <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                           <input type="email" value={adminProfile.email} onChange={e => setAdminProfile({...adminProfile, email: e.target.value})} className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-stone-50 border border-stone-100 outline-none font-bold" />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Oracle Line (Phone)</label>
                        <div className="relative">
                           <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                           <input type="text" value={adminProfile.phone} onChange={e => setAdminProfile({...adminProfile, phone: e.target.value})} className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-stone-50 border border-stone-100 outline-none font-bold" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-4">Oracle Manifest (Bio)</label>
                     <textarea rows={4} value={adminProfile.bio} onChange={e => setAdminProfile({...adminProfile, bio: e.target.value})} className="w-full px-6 py-5 rounded-2xl bg-stone-50 border border-stone-100 outline-none resize-none font-medium" />
                  </div>

                  <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-start gap-4">
                     <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                     <div>
                        <p className="text-amber-900 font-bold text-sm">Security Protocol</p>
                        <p className="text-amber-700 text-xs mt-1">To change your primary authentication ritual (password), please use the Secure Key vault in the Maison HQ.</p>
                     </div>
                  </div>

                  <button type="submit" className="w-full bg-stone-900 text-white py-6 rounded-full font-bold shadow-2xl hover:bg-amber-600 transition-all flex items-center justify-center gap-3">
                    <ShieldCheck className="w-5 h-5" /> Harmonize Security Profile
                  </button>
               </form>
            </motion.div>
          )}

          {/* 7. CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto py-12 space-y-12">
               <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                    <LayoutGrid className="w-10 h-10" />
                  </div>
                  <h2 className="text-4xl font-serif">Category Sanctum</h2>
                  <p className="text-stone-400 font-light">Define the architectural hubs of the Lumière Maison.</p>
               </div>

               <div className="bg-white p-12 rounded-[3.5rem] border border-stone-100 shadow-xl space-y-10">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {categories.map(cat => (
                     <div key={cat} className="flex items-center justify-between p-6 bg-stone-50 rounded-3xl border border-stone-100 group">
                       <div className="flex items-center gap-4">
                         <div className="w-2 h-2 rounded-full bg-amber-400" />
                         <span className="font-bold text-stone-700">{cat}</span>
                       </div>
                       {cat !== 'All' && (
                         <button onClick={() => {
                            const updated = categories.filter(c => c !== cat);
                            setCategories(updated);
                            dbService.saveCategories(updated);
                         }} className="p-2 text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                           <Trash2 className="w-4 h-4" />
                         </button>
                       )}
                     </div>
                   ))}
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Admin;
