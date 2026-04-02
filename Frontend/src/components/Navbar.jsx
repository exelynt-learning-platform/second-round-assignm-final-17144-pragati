import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser, clearAuthData, isAuthenticated, isAdmin } from "../utils/helpers";
import { getCart } from "../services/cartService";
import { ShoppingBag, User, LogOut, Menu, X, LayoutDashboard, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const user = getUser();
  const loggedIn = isAuthenticated();
  const admin = isAdmin();

  const fetchCartCount = async () => {
    if (!loggedIn) {
      setCartCount(0);
      return;
    }
    try {
      const response = await getCart();
      setCartCount(response.data.data.length);
    } catch (err) {
      console.error("Error fetching cart count", err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    fetchCartCount();

    // Poll every 30 seconds for cart updates (or we could use an event emitter/context)
    const interval = setInterval(fetchCartCount, 30000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, [loggedIn]);

  const logout = () => {
    clearAuthData();
    toast.info("Logged out successfully");
    setCartCount(0);
    navigate("/login");
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ];

  if (loggedIn) {
    menuItems.push({ name: "Orders", path: "/orders" });
    if (admin) {
      menuItems.push({ name: "Admin", path: "/admin", icon: LayoutDashboard });
    }
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass-dark py-3 shadow-lg border-b border-white/5" : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <ShoppingBag className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Shop<span className="text-primary-500">Ease</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary-400 relative py-1 ${isActive(item.path) ? "text-primary-500" : "text-slate-300"
                }`}
            >
              {item.name}
              {isActive(item.path) && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="relative p-2 text-slate-300 hover:text-white transition-all hover:scale-110"
          >
            <ShoppingCart className="w-6 h-6" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-0 right-0 w-5 h-5 bg-accent-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-bg-dark shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {loggedIn ? (
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-400">Welcome,</span>
                <span className="text-sm font-bold text-white">
                  {user?.user_name?.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-accent-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary !py-2 !px-5 text-sm shadow-lg shadow-primary-600/20">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            style={{ originY: 0 }}
            className="md:hidden glass-dark border-t border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="container mx-auto px-4 py-8 flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xl font-bold p-4 rounded-2xl flex justify-between items-center ${isActive(item.path) ? "bg-primary-600/10 text-primary-400 border border-primary-600/20" : "text-slate-300"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                  <ArrowRight className={`w-5 h-5 ${isActive(item.path) ? "opacity-100" : "opacity-0"}`} />
                </Link>
              ))}

              {!loggedIn && (
                <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                  <Link to="/login" className="text-center p-4 rounded-2xl border border-white/10 text-white font-bold" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary w-full py-4 rounded-2xl text-lg shadow-xl" onClick={() => setMobileMenuOpen(false)}>
                    Register Account
                  </Link>
                </div>
              )}

              {loggedIn && (
                <div className="pt-6 border-t border-white/10">
                  <div className="mb-6 px-2">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Authenticated as</p>
                    <p className="text-white font-bold">{user?.user_name}</p>
                    <p className="text-slate-400 text-sm italic line-clamp-1">{user?.email_address}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-3 p-4 text-accent-500 bg-accent-500/10 border border-accent-500/20 rounded-2xl font-bold"
                  >
                    <LogOut className="w-5 h-5" /> Logout Session
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
