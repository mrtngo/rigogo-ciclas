import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import AdminDashboard from './pages/AdminDashboard';
import Vender from './pages/Vender';
import Taller from './pages/Taller';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-shell">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/vender" element={<ProtectedRoute><Vender /></ProtectedRoute>} />
              <Route path="/taller" element={<Taller />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
