import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { setAuthData } from "../utils/helpers";
import { toast } from "react-toastify";
import { User, Mail, Phone, Lock, ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const Register = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    email_address: "",
    password: "",
    mobile_no: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.user_name || !formData.email_address || !formData.password) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser(formData);
      const data = response.data;
      if (data && data.token) {
        setAuthData(data.token, {
          user_id: data.user_id,
          user_name: data.user_name,
          email_address: data.email_address,
          role: data.role
        });
        toast.success(`Account created! Welcome, ${data.user_name}!`);
        navigate("/");
      }
    } catch (err) {
      if (err.response?.data?.data) {
        const validationErrs = Object.values(err.response.data.data).join(", ");
        toast.error(validationErrs);
      } else {
        toast.error(err.response?.data?.message || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-28 pb-12 px-4 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-primary-900/10 via-bg-dark to-bg-dark">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="card glass-dark p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary-600/10 rounded-full blur-3xl"></div>
          
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
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-slate-400">Join our community and start shopping</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="text"
                    name="user_name"
                    className="input-field pl-12"
                    placeholder="John Doe"
                    value={formData.user_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="text"
                    name="mobile_no"
                    className="input-field pl-12"
                    placeholder="+1 234 567 890"
                    value={formData.mobile_no}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
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
                className="btn btn-primary w-full py-4 mt-6 gap-2 group" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors underline-offset-4 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
