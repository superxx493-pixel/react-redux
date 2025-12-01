import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`https://fakestoreapi.com/products/${id}`).then(r => setProduct(r.data));
  }, [id]);

  if (!product) return <p style={{ padding: '2rem', textAlign: 'center' }}>Loading...</p>;

  return (
    <div style={{ padding: '2rem', display: 'flex', gap: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <img src={product.image} alt={product.title} width={300} style={{ objectFit: 'contain' }} />
      <div>
        <h1>{product.title}</h1>
        <p style={{ lineHeight: 1.6, color: '#555' }}>{product.description}</p>
        <h2 style={{ color: '#27ae60' }}>${product.price}</h2>
        <button onClick={() => dispatch(addToCart(product))} style={{ padding: '12px 24px', fontSize: '1.1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Add to Cart
        </button>
        <Link to="/" style={{ marginLeft: '1rem', color: '#007bff' }}>← Back</Link>
      </div>
    </div>
  );
}