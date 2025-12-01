import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Products from './components/Products';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}