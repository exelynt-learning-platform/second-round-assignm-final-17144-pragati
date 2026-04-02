import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeFromCart } from "../services/cartService";
import { getProductImageUrl } from "../services/productService";
import { formatPrice } from "../utils/helpers";
import { toast } from "react-toastify";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await getCart();
      setCartItems(response.data.data);
    } catch (err) {
      toast.error("Failed to load cart.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId, newQuantity, currentStock) => {
    if (newQuantity < 1) return;
    if (newQuantity > currentStock) {
      toast.warn(`Only ${currentStock} items in stock.`);
      return;
    }
    
    setUpdatingId(itemId);
    try {
      await updateCartItem(itemId, newQuantity);
      await fetchCart(false);
    } catch (err) {
      toast.error("Failed to update quantity.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (itemId) => {
    setUpdatingId(itemId);
    try {
      await removeFromCart(itemId);
      toast.success("Item removed from cart");
      await fetchCart(false);
    } catch (err) {
      toast.error("Failed to remove item.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        <p className="text-slate-400 animate-pulse">Loading your cart...</p>
      </div>
    );
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const isMinimumAmountReached = totalAmount >= 50;

  return (
    <div className="container mx-auto px-4 pt-32 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center md:text-left"
      >
        <h1 className="text-4xl font-extrabold mb-2">Shopping <span className="text-primary-500">Cart</span></h1>
        <p className="text-slate-400">You have {cartItems.length} items in your bag</p>
      </motion.div>

      {cartItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-dark rounded-3xl p-12 text-center max-w-2xl mx-auto border border-white/5 shadow-2xl"
        >
          <div className="w-24 h-24 bg-primary-600/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-12 h-12 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is feeling light</h2>
          <p className="text-slate-400 mb-10 max-w-sm mx-auto">
            Looks like you haven't added anything to your cart yet. Explore our latest products and find something you love.
          </p>
          <Link to="/products" className="btn btn-primary px-8">
            Start Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence>
              {cartItems.map((item) => {
                const product = item.product;
                const imageUrl = product.product_image ? getProductImageUrl(product.product_image) : null;
                const isUpdating = updatingId === item.cart_item_id;
                
                return (
                  <motion.div 
                    key={item.cart_item_id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="card glass-dark hover:border-white/10 p-5 group flex flex-col sm:flex-row gap-6 items-center"
                  >
                    <div className="w-full sm:w-32 aspect-square rounded-2xl overflow-hidden bg-bg-elevated relative group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-shadow">
                      {imageUrl ? (
                        <img src={imageUrl} alt={product.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-10 h-10 text-slate-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    
                    <div className="flex-grow flex flex-col gap-1 w-full text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-primary-400 font-bold mb-1 block">
                            {product.category}
                          </span>
                          <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                            <Link to={`/products/${product.product_id}`}>{product.product_name}</Link>
                          </h3>
                        </div>
                        <div className="text-xl font-black text-white sm:text-right">
                          {formatPrice(product.price * item.quantity)}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center justify-center sm:justify-start gap-4">
                          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                            <button 
                              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30"
                              onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1, product.stock_quantity)}
                              disabled={item.quantity <= 1 || isUpdating}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-bold text-white">
                              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : item.quantity}
                            </span>
                            <button 
                              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30"
                              onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1, product.stock_quantity)}
                              disabled={item.quantity >= product.stock_quantity || isUpdating}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button 
                            className="p-3 text-slate-500 hover:text-accent-500 hover:bg-accent-500/10 rounded-xl transition-all"
                            onClick={() => handleRemove(item.cart_item_id)}
                            disabled={isUpdating}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="text-sm text-slate-500">
                          {formatPrice(product.price)} / each
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Cart Summary Section */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card glass-dark p-8 border-white/10 shadow-2xl sticky top-32"
            >
              <h3 className="text-2xl font-bold text-white mb-8">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="text-white font-medium">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="text-primary-400 font-medium">calculated at next step</span>
                </div>
                <div className="flex justify-between text-slate-400 border-b border-white/10 pb-4">
                  <span>Tax (included)</span>
                  <span className="text-white font-medium">₹0.00</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-white pt-2">
                  <span>Total</span>
                  <span className="text-primary-500">{formatPrice(totalAmount)}</span>
                </div>
              </div>
              
              {!isMinimumAmountReached && (
                <div className="glass bg-accent-600/10 border-accent-600/30 p-4 rounded-xl mb-6 flex gap-3 items-start">
                  <Info className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-accent-200 leading-relaxed">
                    Minimum order amount for checkout is <span className="font-bold underline">₹50</span>. Please add more items to reach the minimum.
                  </p>
                </div>
              )}
              
              <button 
                className="btn btn-primary w-full py-4 px-6 text-lg tracking-wide group"
                onClick={() => navigate("/checkout")}
                disabled={!isMinimumAmountReached}
              >
                Checkout Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="mt-8 flex flex-col items-center gap-4 border-t border-white/10 pt-6">
                <p className="text-slate-500 text-xs text-center flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span> Secure checkout processed via Stripe
                </p>
                <div className="flex items-center gap-3 opacity-30 grayscale">
                  <div className="w-10 h-6 bg-slate-400 rounded-sm"></div>
                  <div className="w-10 h-6 bg-slate-400 rounded-sm"></div>
                  <div className="w-10 h-6 bg-slate-400 rounded-sm"></div>
                </div>
                <Link to="/products" className="text-primary-400 text-sm hover:text-primary-300 transition-colors mt-2">
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
