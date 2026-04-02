import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import { ArrowRight, ShoppingBag, Sparkles, ShieldCheck, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        setFeaturedProducts(response.data.data.slice(0, 4));
      } catch (err) {
        console.error("Error fetching featured products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const features = [
    { icon: <Zap className="w-6 h-6" />, title: "Fast Delivery", desc: "Get your items delivered within 24-48 hours." },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Secure Payment", desc: "100% secure payment processing with Stripe." },
    { icon: <Sparkles className="w-6 h-6" />, title: "Premium Quality", desc: "We only source the best products for our customers." },
    { icon: <Globe className="w-6 h-6" />, title: "World Wide", desc: "We ship to over 150+ countries globally." }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center pt-20 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-primary-400 text-sm font-semibold mb-8 shadow-xl"
            >
              <Sparkles className="w-4 h-4" />
              <span>Spring 2024 Collection is Live</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-8 leading-[1.1]"
            >
              Discover Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-600 to-accent-500">
                Premium Style
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              ShopEase offers a curated selection of the best tech, fashion, and lifestyle items. Built with performance and elegance in mind.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/products" className="btn btn-primary w-full sm:w-auto px-10 py-4 text-lg gap-2 group">
                Shop Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="btn btn-secondary w-full sm:w-auto px-10 py-4 text-lg">
                Join Community
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-bg-card/50 border-y border-white/5 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-600/10 flex items-center justify-center text-primary-500 shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">{feature.title}</h4>
                  <p className="text-slate-500 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div>
              <span className="text-primary-500 font-bold tracking-widest text-sm uppercase mb-3 block">
                Trending Now
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white">Featured Selection</h2>
            </div>
            <Link 
              to="/products" 
              className="group flex items-center gap-2 text-primary-400 font-bold hover:text-primary-300 transition-colors"
            >
              Explore Everything 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card h-[400px] animate-pulse bg-bg-elevated/50 rounded-2xl"></div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, idx) => (
                <motion.div
                  key={product.product_id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-dark rounded-3xl p-20 text-center flex flex-col items-center">
              <ShoppingBag className="w-16 h-16 text-slate-700 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">Inventory is low</h3>
              <p className="text-slate-400">Our team is working on stocking up some beautiful items for you.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-32">
        <div className="relative glass-dark rounded-[3rem] p-12 md:p-24 overflow-hidden border border-white/5 text-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-600/5 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Stay in the Loop</h2>
            <p className="text-slate-400 text-lg mb-10">
              Join our newsletter for exclusive offers, styling secrets, and first access to our drop releases.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input-field grow !py-4"
              />
              <button className="btn btn-primary px-10 py-4">Subscribe</button>
            </div>
            <p className="text-slate-600 text-xs mt-6">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
