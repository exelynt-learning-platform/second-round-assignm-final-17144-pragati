import { useState, useEffect } from "react";
import { addProduct, getAllProducts } from "../services/productService";
import { formatPrice } from "../utils/helpers";
import { toast } from "react-toastify";
import { PackagePlus, Database, Search, IndianRupee, Tag, Layers, FileText, Upload, Loader2, BarChart3, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Product state
  const [productData, setProductData] = useState({
    product_name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "Electronics"
  });
  const [imageFile, setImageFile] = useState(null);
  
  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data.data);
    } catch (err) {
      toast.error("Could not fetch inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("product_name", productData.product_name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("stock_quantity", productData.stock_quantity);
      formData.append("category", productData.category);
      if (imageFile) {
        formData.append("product_image", imageFile);
      }

      await addProduct(formData);
      
      toast.success("Product successfully added to inventory!");
      setProductData({
        product_name: "", description: "", price: "", stock_quantity: "", category: "Electronics"
      });
      setImageFile(null);
      // Reset file input
      const fileInput = document.getElementById("imageInput");
      if (fileInput) fileInput.value = "";
      
      fetchProducts(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 pt-32 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <span className="text-primary-500 font-bold uppercase tracking-[0.25em] text-[10px] mb-2 block">Admin Access Room</span>
        <h1 className="text-4xl font-black text-white">Dashboard <span className="text-primary-500">Inventory</span></h1>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Total items", value: products.length, icon: <Database className="w-5 h-5" />, color: "primary" },
          { label: "Low stock counts", value: products.filter(p => p.stock_quantity < 5).length, icon: <TrendingUp className="w-5 h-5" />, color: "accent" },
          { label: "Inventory Value", value: formatPrice(products.reduce((acc, p) => acc + (p.price * p.stock_quantity), 0)), icon: <BarChart3 className="w-5 h-5" />, color: "green" },
        ].map((stat, i) => (
          <div key={i} className="card glass-dark p-6 border-white/5 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-white">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color === 'primary' ? 'primary-600/10 text-primary-500' : stat.color === 'accent' ? 'accent-600/10 text-accent-500' : 'green-600/10 text-green-500'} flex items-center justify-center`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* ADD PRODUCT FORM */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4"
        >
          <div className="card glass-dark p-8 border-white/10 sticky top-32">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <PackagePlus className="w-6 h-6 text-primary-500" />
              Ingest New Product
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">General Title</label>
                <div className="relative group">
                   <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                   <input type="text" name="product_name" className="input-field !pl-12" placeholder="e.g. Sony WH-1000XM4" value={productData.product_name} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Industry Category</label>
                <div className="relative group">
                   <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
                    <select name="category" className="input-field !pl-12 appearance-none" value={productData.category} onChange={handleChange}>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home">Home & Kitchen</option>
                      <option value="Books">Books</option>
                    </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Price</label>
                  <div className="relative group">
                     <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                     <input type="number" step="0.01" name="price" className="input-field !pl-10" placeholder="0.00" value={productData.price} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Units</label>
                  <div className="relative group">
                     <Database className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                     <input type="number" name="stock_quantity" className="input-field !pl-10" placeholder="qty" value={productData.stock_quantity} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Technical Specs / Desc</label>
                <div className="relative group">
                   <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                   <textarea name="description" className="input-field !pl-12 min-h-[120px]" placeholder="Briefly describe the product features..." rows="3" value={productData.description} onChange={handleChange} required></textarea>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Media Payload</label>
                <div className="relative group">
                   <div className="input-field !p-0 overflow-hidden cursor-pointer flex items-center h-[52px]">
                      <span className="bg-white/5 h-full px-4 flex items-center border-r border-white/10 text-slate-500 group-hover:bg-white/10 transition-colors">
                        <Upload className="w-4 h-4" />
                      </span>
                      <input type="file" id="imageInput" accept="image/*" className="w-full opacity-0 absolute inset-0 cursor-pointer" onChange={handleFileChange} />
                      <span className="px-4 text-slate-500 text-sm italic truncate">
                        {imageFile ? imageFile.name : "Select JPG/PNG..."}
                      </span>
                   </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full py-4 text-lg font-bold group mt-4" disabled={submitting}>
                {submitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (
                  <>Add to Database</>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* INVENTORY LIST */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8"
        >
          <div className="card glass-dark p-0 border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  Inventory Catalog
                  <span className="badge bg-primary-600/20 text-primary-400 border-none">{products.length}</span>
                </h3>
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input 
                    type="text" 
                    placeholder="Quick search..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary-500 focus:bg-white/10 transition-all font-medium" 
                  />
                </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-[9px] uppercase tracking-[0.2em] font-black text-slate-500">
                    <th className="px-6 py-4">Reference</th>
                    <th className="px-6 py-4">Item Details</th>
                    <th className="px-6 py-4">Division</th>
                    <th className="px-6 py-4">Financials</th>
                    <th className="px-6 py-4">Unit Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary-500 mx-auto mb-4" />
                        <p className="text-slate-500 italic">Syncing inventory...</p>
                      </td>
                    </tr>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map(p => (
                      <tr key={p.product_id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-5 align-top">
                          <span className="text-xs font-mono text-slate-600">ID# {p.product_id.toString().padStart(4, '0')}</span>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <div>
                            <p className="font-bold text-white group-hover:text-primary-400 transition-colors">{p.product_name}</p>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-1 max-w-xs">{p.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <span className="badge glass-dark !px-2 !py-0.5 text-[9px] border-white/10 text-primary-400">{p.category}</span>
                        </td>
                        <td className="px-6 py-5 align-top font-black text-white">
                          <span className="text-primary-500 text-xs mr-0.5">₹</span>{p.price.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-5 align-top">
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${p.stock_quantity > 10 ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : p.stock_quantity > 0 ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' : 'bg-accent-500 shadow-[0_0_8px_#ef4444]'}`}></div>
                             <span className={`font-bold ${p.stock_quantity > 0 ? 'text-white' : 'text-accent-500'}`}>{p.stock_quantity}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center">
                        <p className="text-slate-600 italic">No inventory matching "{searchTerm}"</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-white/[0.01] border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              <span>Showing {filteredProducts.length} entries</span>
              <div className="flex gap-4">
                <button className="hover:text-primary-500 transition-colors disabled:opacity-20" disabled>Previous</button>
                <button className="hover:text-primary-500 transition-colors disabled:opacity-20" disabled>Next</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
