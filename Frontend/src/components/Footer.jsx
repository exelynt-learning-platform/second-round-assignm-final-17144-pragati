import { Link } from "react-router-dom";
import { ShoppingBag, Mail, Phone, MapPin } from "lucide-react";

const Facebook = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);
const Twitter = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);
const Instagram = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
);
const Github = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
);

const Footer = () => {
  return (
    <footer className="bg-bg-dark border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <ShoppingBag className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Shop<span className="text-primary-500">Ease</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Your one-stop destination for premium tech, fashion, and lifestyle products. We bring quality and style to your doorstep.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-slate-400 hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-slate-400 hover:text-primary-400 transition-colors">Shop All Products</Link></li>
              <li><Link to="/cart" className="text-slate-400 hover:text-primary-400 transition-colors">Your Cart</Link></li>
              <li><Link to="/orders" className="text-slate-400 hover:text-primary-400 transition-colors">Track Orders</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Popular Categories</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-slate-400 hover:text-primary-400 transition-colors">Electronics</Link></li>
              <li><Link to="/products" className="text-slate-400 hover:text-primary-400 transition-colors">Modern Fashion</Link></li>
              <li><Link to="/products" className="text-slate-400 hover:text-primary-400 transition-colors">Home Decor</Link></li>
              <li><Link to="/products" className="text-slate-400 hover:text-primary-400 transition-colors">Books & Media</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400">
                <MapPin className="w-5 h-5 text-primary-500" />
                <span>123 Innovation Way, Tech City, TC 10101</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="w-5 h-5 text-primary-500" />
                <span>support@shopease.com</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-5 h-5 text-primary-500" />
                <span>+1 (800) 555-0199</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm italic">
            © 2026 ShopEase. Built with passion by Antigravity.
          </p>
          <div className="flex gap-8 text-xs text-slate-500 font-medium">
            <button className="hover:text-primary-400 transition-colors uppercase tracking-wider">Privacy Policy</button>
            <button className="hover:text-primary-400 transition-colors uppercase tracking-wider">Terms of Service</button>
            <button className="hover:text-primary-400 transition-colors uppercase tracking-wider">Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
