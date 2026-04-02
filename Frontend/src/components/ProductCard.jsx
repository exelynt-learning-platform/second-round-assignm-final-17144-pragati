import { Link } from "react-router-dom";
import { addToCart } from "../services/cartService";
import { getProductImageUrl } from "../services/productService";
import { formatPrice, isAuthenticated } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { ShoppingCart, Eye, Package } from "lucide-react";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      toast.warn("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart({ product_id: product.product_id, quantity: 1 });
      toast.success(`${product.product_name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  const imageUrl = product.product_image
    ? getProductImageUrl(product.product_image)
    : null;

  const isOutOfStock = product.stock_quantity === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card group flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden block">
        <Link to={`/products/${product.product_id}`} className="absolute inset-0 z-0">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={product.product_name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          ) : (
            <div className="w-full h-full bg-bg-elevated flex items-center justify-center">
              <Package className="w-12 h-12 text-slate-700" />
            </div>
          )}
        </Link>
        
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 pointer-events-none z-10">
          <Link 
            to={`/products/${product.product_id}`}
            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors pointer-events-auto"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </Link>
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock || addingToCart}
            className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-500 disabled:bg-slate-700 transition-colors pointer-events-auto"
            title="Add to Cart"
          >
            {addingToCart ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </button>
        </div>

        {isOutOfStock && (
          <div className="absolute top-4 right-4 badge bg-accent-600 text-white pointer-events-none z-10">
            Sold Out
          </div>
        )}
        <div className="absolute top-4 left-4 badge glass-dark text-primary-400 text-[10px] pointer-events-none z-10">
          {product.category}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold line-clamp-1 group-hover:text-primary-400 transition-colors">
            <Link to={`/products/${product.product_id}`}>{product.product_name}</Link>
          </h3>
          <span className="text-primary-400 font-bold ml-2">
            {formatPrice(product.price)}
          </span>
        </div>
        
        <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <button
          className={`btn w-full gap-2 ${isOutOfStock ? "bg-slate-800 text-slate-500" : "btn-primary"}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock || addingToCart}
        >
          {addingToCart ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
