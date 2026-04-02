import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { setAuthData } from "../utils/helpers";
import { toast } from "react-toastify";
import { Mail, Lock, ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({ email_address: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email_address || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(formData);
      const data = response.data;
      if (data && data.token) {
        setAuthData(data.token, {
          user_id: data.user_id,
          user_name: data.user_name,
          email_address: data.email_address,
          role: data.role
        });
        toast.success(`Welcome back, ${data.user_name}!`);
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-900/20 via-bg-dark to-bg-dark">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="card glass-dark p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-600/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col items-center text-center mb-10">
              <Link to="/" className="flex items-center gap-2 mb-6 group">
                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                  <ShoppingBag className="text-white w-7 h-7" />
                </div>
                <span className="text-3xl font-black tracking-tighter text-white">
                  Shop<span className="text-primary-500">Ease</span>
                </span>
              </Link>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-400">Please enter your details to sign in</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="email"
                    name="email_address"
                    className="input-field pl-12"
                    placeholder="name@example.com"
                    value={formData.email_address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <Link to="#" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="password"
                    name="password"
                    className="input-field pl-12"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full py-4 mt-4 gap-2 group" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors underline-offset-4 hover:underline">
                Create one for free
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
