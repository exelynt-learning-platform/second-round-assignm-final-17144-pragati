import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import { ProtectedRoute, AdminRoute } from "./routes/ProtectedRoute";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// Load Stripe (Publishable Key)
const stripePromise = loadStripe("pk_test_51TH0aJ18z5EvV2WEhATWPk6caWekWsHH3XoTaTHzzfltAOV6mGVCTIWGu2pbMA0uzeJ964c8D0NkHDvLF0I4fqWT00mJR82eWe");

const App = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User Protected Routes */}
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Elements stripe={stripePromise}>
                  <Checkout />
                </Elements>
              </ProtectedRoute>
            } />
            
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </Router>
  );
};

export default App;
