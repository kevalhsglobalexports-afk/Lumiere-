
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, Truck, CheckCircle2, ShoppingBag, ArrowLeft, Search, Copy, Check, ExternalLink } from 'lucide-react';
import { dbService } from '../services/db';
import { Order } from '../types';

interface MyOrdersProps {
  user: { name: string; email: string; isAdmin?: boolean } | null;
  formatPrice: (usdPrice: number) => string;
}

const OrderCard: React.FC<{ order: Order; formatPrice: (p: number) => string; onTrack: (id: string) => void }> = ({ order, formatPrice, onTrack }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-stone-100 rounded-[3rem] p-8 md:p-10 shadow-sm hover:shadow-xl transition-all group"
    >
      <div className="flex flex-col lg:flex-row justify-between gap-10">
        <div className="space-y-6 flex-1">
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={handleCopy}
              className="group/id flex items-center gap-2 text-[10px] font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-full border border-amber-100 uppercase tracking-widest hover:bg-amber-100 transition-all"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 text-amber-400 group-hover/id:text-amber-600" />}
              {order.id}
            </button>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
              order.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
              order.status === 'Shipped' ? 'bg-blue-50 text-blue-600 border-blue-100' :
              'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
              {order.status === 'Pending' ? <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> Pending Synthesis</span> :
               order.status === 'Shipped' ? <span className="flex items-center gap-2"><Truck className="w-3 h-3" /> In Transit</span> :
               <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> Fulfilled</span>}
            </span>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{order.date}</span>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="relative shrink-0">
                <img src={item.image} className="w-16 h-20 rounded-2xl object-cover border border-stone-50" />
                <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[8px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col justify-between items-end gap-6 border-t lg:border-t-0 lg:border-l border-stone-50 pt-8 lg:pt-0 lg:pl-10">
          <div className="text-right">
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Ritual Value</p>
            <p className="text-3xl font-serif text-stone-900">{formatPrice(order.total)}</p>
          </div>
          <button 
            onClick={() => onTrack(order.id)}
            className="w-full sm:w-auto bg-stone-900 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2 group"
          >
            Track Journey <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const MyOrders: React.FC<MyOrdersProps> = ({ user, formatPrice }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    const allOrders = dbService.getOrders();
    const userOrders = allOrders.filter(o => o.customerEmail.toLowerCase() === user.email.toLowerCase());
    setOrders(userOrders);
  }, [user, navigate]);

  const handleTrack = (id: string) => {
    navigate(`/track-ritual?id=${id}`);
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-20 min-h-[80vh]">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <Link to="/" className="text-stone-400 hover:text-stone-900 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors mb-4">
            <ArrowLeft className="w-3 h-3" /> Back to Sanctuary
          </Link>
          <h1 className="text-5xl font-serif">My Rituals</h1>
          <p className="text-stone-500 font-light">Your history of botanical acquisitions.</p>
        </div>
        <Link to="/shop" className="bg-stone-900 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-amber-600 transition-all flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" /> Discover More
        </Link>
      </div>

      <div className="space-y-8">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} formatPrice={formatPrice} onTrack={handleTrack} />
          ))
        ) : (
          <div className="bg-white rounded-[4rem] p-24 text-center space-y-8 border border-stone-100">
            <div className="w-24 h-24 bg-stone-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-stone-200">
              <Package className="w-10 h-10" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-serif">No Rituals Yet</h2>
              <p className="text-stone-500 font-light max-w-xs mx-auto">Your acquisition history is empty. Start your botanical journey today.</p>
            </div>
            <Link to="/shop" className="inline-block bg-stone-900 text-white px-12 py-5 rounded-full font-bold shadow-xl">Start Shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
