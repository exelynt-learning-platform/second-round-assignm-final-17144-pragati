import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCart } from "../services/cartService";
import { createOrder } from "../services/orderService";
import { createPaymentSession, confirmPaymentSuccess, confirmPaymentFailure } from "../services/paymentService";
import { formatPrice } from "../utils/helpers";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { ShieldCheck, Truck, CreditCard, Lock, Info, ChevronLeft, Loader2, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCart();
        setCartItems(response.data.data);
        if (response.data.data.length === 0) {
          toast.info("Your cart is empty. Please add items before checking out.");
          navigate("/cart");
        }
      } catch (err) {
        toast.error("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      toast.warn("Please enter a valid shipping address");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      navigate("/cart");
      return;
    }

    if (!stripe || !elements) {
      toast.error("Stripe is still loading. Please try again in a moment.");
      return;
    }

    if (totalAmount < 50) {
      toast.error("Minimum order value for payment is ₹50.");
      return;
    }

    setProcessing(true);

    try {
      // 1. Create Order
      const orderRes = await createOrder({ shipping_address: shippingAddress });
      const order = orderRes.data.data;
      const orderId = order.order_id;

      // 2. Create Payment Session
      const sessionRes = await createPaymentSession(orderId);
      const { clientSecret } = sessionRes.data.data;
      const user = order.user;

      // 3. Confirm Payment
      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user.user_name,
            email: user.email_address,
            address: {
              line1: shippingAddress
            }
          }
        }
      });

      if (paymentResult.error) {
        await confirmPaymentFailure(orderId);
        toast.error(paymentResult.error.message);
        setProcessing(false);
      } else {
        if (paymentResult.paymentIntent.status === "succeeded") {
          await confirmPaymentSuccess(orderId, paymentResult.paymentIntent.id);
          toast.success("Payment Received! Your order has been placed.");
          navigate("/orders");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred during checkout.");
      setProcessing(false);
    }
  };

  const CARD_OPTIONS = {
    iconStyle: 'solid',
    style: {
      base: {
        iconColor: '#3b82f6',
        color: '#fff',
        fontWeight: '500',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        '::placeholder': { color: '#64748b' },
      },
      invalid: {
        iconColor: '#ef4444',
        color: '#ef4444',
      },
    },
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        <p className="text-slate-400 animate-pulse">Initializing secure checkout...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <Link to="/cart" className="text-slate-500 hover:text-white flex items-center gap-1 text-sm mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Return to bag
        </Link>
        <h1 className="text-4xl font-extrabold text-white">Finalize <span className="text-primary-500">Purchase</span></h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Section - Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-10"
        >
          {/* Section 1: Shipping */}
          <div className="card glass-dark p-8 border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full -translate-x-[-20%] -translate-y-1/2 blur-2xl"></div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-600/10 flex items-center justify-center text-primary-500">
                <Truck className="w-5 h-5" />
              </div>
              Shipping Destination
            </h3>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Full Delivery Address</label>
              <textarea
                className="input-field min-h-[120px]"
                placeholder="Where should we send your items? (Building, Street, City, Zip...)"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
               <Info className="w-3.5 h-3.5" />
               <span>We deliver world-wide within 3-5 business days.</span>
            </div>
          </div>

          {/* Section 2: Payment */}
          <div className="card glass-dark p-8 border-white/5 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-full -translate-x-[-20%] -translate-y-1/2 blur-3xl"></div>
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  Secure Payment (Stripe)
                </h3>
                <div className="flex gap-1.5 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                  <div className="w-8 h-5 bg-white/10 rounded-sm"></div>
                  <div className="w-8 h-5 bg-white/10 rounded-sm"></div>
                  <div className="w-8 h-5 bg-white/10 rounded-sm"></div>
                </div>
             </div>
             
             <div className="bg-white/5 border border-white/10 p-5 rounded-2xl mb-6">
               <CardElement options={CARD_OPTIONS} />
             </div>

             <div className="p-4 bg-primary-600/5 border border-primary-600/10 rounded-xl mb-8 flex gap-3 items-center">
                <Lock className="w-4 h-4 text-primary-500 shrink-0" />
                <p className="text-[11px] text-slate-400">
                  Your payment data is encrypted and never stored on our servers. You're in test mode. Use card <span className="text-white font-mono font-bold">4242 4242 4...</span>
                </p>
             </div>

             <button
                className="btn btn-primary w-full py-5 text-xl tracking-wide gap-3 group"
                onClick={handleCheckout}
                disabled={processing || !stripe}
              >
                {processing ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Complete Payment ({formatPrice(totalAmount)})
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
          </div>
        </motion.div>

        {/* Right Section - Summary */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5"
        >
          <div className="card glass-dark p-8 border-white/10 shadow-2xl sticky top-32 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-600/5 rounded-full -translate-x-[-30%] -translate-y-1/2 blur-2xl"></div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
               Order Summary
               <div className="badge bg-white/5 border-white/10 text-slate-400">{cartItems.length}</div>
            </h3>
            
            <div className="space-y-5 mb-8 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {cartItems.map((item) => (
                <div key={item.cart_item_id} className="flex gap-4 group">
                  <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden border border-white/5 shrink-0">
                     <ShoppingBag className="w-full h-full p-4 text-slate-700" />
                  </div>
                  <div className="flex-grow py-1">
                    <h5 className="text-white font-bold text-sm tracking-tight group-hover:text-primary-400 transition-colors line-clamp-1">{item.product.product_name}</h5>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-slate-500 font-medium">Qty: {item.quantity}</span>
                      <span className="text-sm font-black text-slate-300">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Shipping</span>
                <span className="text-green-500">FREE</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm border-b border-white/5 pb-4">
                <span>Estimated Tax</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-white">Full Total</span>
                <span className="text-3xl font-black text-primary-500">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <div className="mt-10 p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
               <ShieldCheck className="w-10 h-10 text-primary-500" />
               <div className="space-y-0.5">
                  <p className="text-xs font-black text-white uppercase tracking-widest">Buyer Protection</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed italic">Money-back guarantee within 30 days of delivery.</p>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
