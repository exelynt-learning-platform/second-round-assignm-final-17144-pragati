import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders, getOrderItems } from "../services/orderService";
import { formatPrice } from "../utils/helpers";
import { Package, Calendar, CreditCard, ChevronRight, Loader2, IndianRupee, MapPin, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getMyOrders();
        const ordersData = response.data.data;
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order) => {
            try {
              const itemRes = await getOrderItems(order.order_id);
              return { ...order, items: itemRes.data.data };
            } catch (err) {
              return { ...order, items: [] };
            }
          })
        );
        setOrders(ordersWithItems);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "SHIPPED": return "bg-primary-500/10 text-primary-500 border-primary-500/20";
      case "CONFIRMED": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "PENDING": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "CANCELLED": return "bg-accent-500/10 text-accent-500 border-accent-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "PAID": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "FAILED": return "bg-accent-500/10 text-accent-500 border-accent-500/20";
      case "PENDING": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        <p className="text-slate-400 animate-pulse">Loading your order history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-20 text-center">
        <div className="glass-dark rounded-3xl p-12 max-w-xl mx-auto border border-accent-500/20">
          <h3 className="text-2xl font-bold text-accent-500 mb-2">{error}</h3>
          <p className="text-slate-400 mb-8">Something went wrong while fetching your orders. Please try again later.</p>
          <button onClick={() => window.location.reload()} className="btn btn-outline">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-black text-white mb-2">My <span className="text-primary-500">Orders</span></h1>
          <p className="text-slate-400">View and track all your purchases in one place</p>
        </div>
        
        {/* Search bar placeholder */}
        <div className="glass-dark border border-white/5 rounded-2xl p-1 flex items-center gap-2 max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-500 ml-4 shrink-0" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="w-full bg-transparent border-none py-3 pr-4 text-sm focus:outline-none placeholder:text-slate-600"
          />
        </div>
      </motion.div>

      {orders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-dark rounded-3xl p-16 text-center max-w-2xl mx-auto border border-white/5 shadow-2xl"
        >
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <Package className="w-12 h-12 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No order history found</h2>
          <p className="text-slate-400 mb-10 max-w-sm mx-auto">
            You haven't placed any orders yet. Once you make a purchase, it will appear here.
          </p>
          <Link to="/products" className="btn btn-primary px-10">
            Browse Products
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {orders.map((order, idx) => {
              const date = new Date(order.order_date).toLocaleDateString("en-GB", {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              });

              return (
                <motion.div 
                  key={order.order_id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card glass-dark overflow-hidden group hover:border-white/10"
                >
                  <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex flex-col sm:flex-row gap-6 md:gap-12">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Order Reference</span>
                        <h4 className="text-white font-mono text-lg font-bold">#{order.order_id.toString().padStart(6, '0')}</h4>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Placement Date</span>
                        <div className="flex items-center gap-2 text-slate-300 font-medium">
                          <Calendar className="w-4 h-4 text-primary-500" />
                          <span>{date}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Total Value</span>
                        <div className="flex items-center gap-1 text-primary-400 font-black text-lg">
                          <IndianRupee className="w-4 h-4" />
                          <span>{order.total_amount.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`badge border ${getStatusColor(order.order_status)}`}>
                        {order.order_status}
                      </div>
                      <div className={`badge border ${getPaymentStatusColor(order.payment_status)}`}>
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3 h-3" />
                          {order.payment_status}
                        </div>
                      </div>
                      <button className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5 shrink-0" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-white/[0.02]">
                    <h5 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-4 flex items-center gap-2">
                       Purchased Items ({order.items?.length})
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {order.items?.length > 0 ? (
                        order.items.map(item => (
                          <div key={item.order_item_id} className="glass py-2 px-4 rounded-xl border border-white/5 text-sm flex items-center gap-3 group/item">
                            <div className="w-3 h-3 rounded-full bg-primary-600/30 group-hover/item:bg-primary-600 transition-colors"></div>
                            <span className="text-slate-300 pointer-events-none">{item.product.product_name}</span>
                            <span className="text-primary-400 font-black ml-1">x{item.quantity}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-600 italic text-sm">No items found for this order</span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-medium">
                    <div className="flex items-start gap-3 max-w-md">
                      <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-slate-500 uppercase tracking-widest text-[9px] font-bold">Shipping Destination</span>
                        <p className="text-slate-300 leading-relaxed italic">{order.shipping_address}</p>
                      </div>
                    </div>
                    
                    <button className="text-primary-500 hover:text-primary-400 hover:underline underline-offset-4 transition-colors font-bold uppercase tracking-widest text-[10px]">
                      Download Invoice PDF
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Orders;
