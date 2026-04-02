import { useState, useEffect, useCallback } from "react";
import { getAllProducts, getProductsByCategory, searchProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import { Search, Filter, SlidersHorizontal, PackageOpen } from "lucide-react";
import { motion } from "framer-motion";

const SkeletonCard = () => (
  <div className="card h-[450px] animate-pulse flex flex-col">
    <div className="aspect-[4/5] bg-bg-elevated"></div>
    <div className="p-5 flex flex-col gap-3 flex-grow">
      <div className="h-6 bg-bg-elevated rounded-md w-3/4"></div>
      <div className="h-4 bg-bg-elevated rounded-md w-full"></div>
      <div className="h-4 bg-bg-elevated rounded-md w-5/6"></div>
      <div className="mt-auto h-10 bg-bg-elevated rounded-xl w-full"></div>
    </div>
  </div>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let response;
      if (searchQuery.trim() !== "") {
        response = await searchProducts(searchQuery);
      } else if (category !== "ALL") {
        response = await getProductsByCategory(category);
      } else {
        response = await getAllProducts();
      }
      setProducts(response.data.data);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const categories = [
    { value: "ALL", label: "All Categories" },
    { value: "Electronics", label: "Electronics" },
    { value: "Fashion", label: "Fashion" },
    { value: "Home", label: "Home & Kitchen" },
    { value: "Books", label: "Books" },
  ];

  return (
    <div className="container mx-auto px-4 pt-32 pb-20">
      <div className="max-w-4xl mx-auto mb-12">
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold mb-4"
          >
            Explore Our <span className="text-primary-500">Collection</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-xl mx-auto"
          >
            Find the best quality products curated just for you. From electronics to fashion, we have it all.
          </motion.p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center glass-dark p-2 rounded-2xl border border-white/5 shadow-2xl">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              className="w-full bg-transparent border-none rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 placeholder:text-slate-500"
              placeholder="Search for absolute anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-56">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-10 py-3 text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSearchQuery("");
                }}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value} className="bg-bg-dark">{cat.label}</option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="text-center py-20 glass rounded-3xl border-accent-500/20 bg-accent-500/5">
          <h3 className="text-2xl text-accent-500 mb-2 font-bold">{error}</h3>
          <button onClick={fetchProducts} className="btn btn-outline mt-4">Try Again</button>
        </div>
      ) : products.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {products.map(product => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-32 flex flex-col items-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <PackageOpen className="w-12 h-12 text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
          <p className="text-slate-400">Try adjusting your search or search for something else.</p>
          <button
            onClick={() => { setCategory("ALL"); setSearchQuery(""); }}
            className="btn btn-secondary mt-8"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
