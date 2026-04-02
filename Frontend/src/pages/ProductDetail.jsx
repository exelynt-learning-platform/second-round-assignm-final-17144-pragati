import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProductById, getProductImageUrl } from "../services/productService";
import { addToCart } from "../services/cartService";
import { formatPrice, isAuthenticated } from "../utils/helpers";
import { toast } from "react-toastify";
import { ChevronLeft, ShoppingCart, Minus, Plus, Package, ShieldCheck, RefreshCw, Truck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await getProductById(id);
        setProduct(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      toast.warn("Please login to add items to cart");
      navigate("/login");
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart({ product_id: product.product_id, quantity });
      toast.success(`${product.product_name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  const increaseQty = () => {
    if (quantity < product.stock_quantity) setQuantity(qty => qty + 1);
    else toast.info(`Only ${product.stock_quantity} items in stock.`);
  };
  const decreaseQty = () => {
    if (quantity > 1) setQuantity(qty => qty - 1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        <p className="text-slate-400 animate-pulse">Fetching product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-20 text-center">
        <div className="w-24 h-24 bg-accent-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-12 h-12 text-accent-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">{error || "Product not found"}</h2>
        <Link to="/products" className="btn btn-primary px-8">Back to Shop</Link>
      </div>
    );
  }

  const imageUrl = product.product_image ? getProductImageUrl(product.product_image) : null;
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="container mx-auto px-4 pt-32 pb-20">
      {/* Breadcrumbs / Back button */}
      <nav className="mb-10 flex items-center gap-2 text-sm">
        <Link 
          to="/products" 
          className="flex items-center gap-1 text-slate-500 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Catalog
        </Link>
        <span className="text-slate-700">/</span>
        <span className="text-slate-300 font-medium line-clamp-1">{product.product_name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Product Image Section */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="card glass-dark aspect-square overflow-hidden bg-bg-elevated relative group">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={product.product_name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
                <Package className="w-24 h-24 mb-4" />
                <span>No image available</span>
              </div>
            )}
            
            {isOutOfStock && (
              <div className="absolute top-6 right-6 badge bg-accent-600 !px-4 !py-2 text-sm shadow-2xl">
                Out of Stock
              </div>
            )}
            
            <div className="absolute top-6 left-6 badge glass-dark border border-white/10 !px-4 !py-2 text-primary-400 font-bold tracking-widest text-xs uppercase shadow-2xl">
              {product.category}
            </div>
          </div>
          
          {/* Decorative small thumbnails (placeholders for real ones if they existed) */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`card glass-dark aspect-square overflow-hidden border-2 cursor-pointer transition-all ${i === 0 ? "border-primary-500 shadow-lg shadow-primary-500/20 scale-105" : "border-transparent opacity-40 hover:opacity-100"}`}>
                {imageUrl && <img src={imageUrl} alt="" className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product Info Section */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col h-full"
        >
          <div className="flex-grow">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {product.product_name}
            </h1>
            
            <div className="flex items-center gap-6 mb-8">
              <span className="text-4xl font-black text-primary-500">
                {formatPrice(product.price)}
              </span>
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                isOutOfStock ? "bg-accent-600/10 border-accent-600/30 text-accent-500" : "bg-green-600/10 border-green-600/30 text-green-500"
              }`}>
                {isOutOfStock ? "Sold Out" : `Stock: ${product.stock_quantity}`}
              </div>
            </div>

            <div className="p-6 glass-dark rounded-2xl border border-white/5 mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" /> Description
              </h3>
              <p className="text-slate-300 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <div className={`flex items-center bg-white/5 border border-white/10 rounded-2xl p-1 shrink-0 ${isOutOfStock ? "opacity-30 pointer-events-none" : ""}`}>
                <button 
                  className="w-14 h-14 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-90"
                  onClick={decreaseQty}
                  disabled={quantity <= 1 || addingToCart}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-14 text-center font-black text-xl text-white">
                  {quantity}
                </span>
                <button 
                  className="w-14 h-14 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-90"
                  onClick={increaseQty}
                  disabled={quantity >= product.stock_quantity || addingToCart}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <button 
                className="btn btn-primary w-full py-5 text-xl tracking-wide gap-3 group"
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
              >
                {addingToCart ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : isOutOfStock ? (
                  "Currently Unavailable"
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    Secure Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-10 border-t border-white/5">
            {[
              { icon: <Truck className="w-5 h-5" />, text: "Free Fast Shipping" },
              { icon: <ShieldCheck className="w-5 h-5" />, text: "2 Year Warranty" },
              { icon: <RefreshCw className="w-5 h-5" />, text: "30 Day Returns" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-600/10 flex items-center justify-center text-primary-500">
                  {item.icon}
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
