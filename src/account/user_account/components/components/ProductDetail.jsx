import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../fetures/cart/cartSlice';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();

  // Get cart items from Redux to check if this product is already added
  const cartItems = useSelector(state => state.cart.items);
  const isInCart = cartItems.some(item => item.id === Number(id));

  useEffect(() => {
    axios.get(`https://fakestoreapi.com/products/${id}`).then(r => setProduct(r.data));
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  if (!product) return <p style={{ padding: '3rem', textAlign: 'center', fontSize: '1.2rem' }}>Loading product...</p>;

  return (
    <div style={{ padding: '2rem', display: 'flex', gap: '3rem', maxWidth: 1200, margin: '0 auto', flexWrap: 'wrap' }}>
      {/* Product Image */}
      <div style={{ flex: '0 0 380px' }}>
        <img 
          src={product.image} 
          alt={product.title} 
          style={{ 
            width: '100%', 
            maxWidth: 380, 
            height: 420, 
            objectFit: 'contain', 
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }} 
        />
      </div>

      {/* Product Info */}
      <div style={{ flex: 1, minWidth: 300 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#2c3e50' }}>
          {product.title}
        </h1>
        
        <p style={{ 
          lineHeight: 1.8, 
          color: '#555', 
          fontSize: '1.1rem', 
          marginBottom: '1.5rem',
          borderBottom: '1px solid #eee',
          paddingBottom: '1.5rem'
        }}>
          {product.description}
        </p>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            fontSize: '2.2rem', 
            color: '#27ae60', 
            fontWeight: 'bold',
            margin: '0'
          }}>
            ${product.price.toFixed(2)}
          </h2>
        </div>

        {/* Smart Add to Cart Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={handleAddToCart}
            style={{
              padding: '14px 32px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: isInCart ? '#28a745' : '#007bff',
              color: 'white',
              boxShadow: isInCart ? '0 4px 15px rgba(40, 167, 69, 0.4)' : '0 4px 15px rgba(0, 123, 255, 0.4)',
              transform: isInCart ? 'scale(1.05)' : 'scale(1)'
            }}
            onMouseOver={e => !isInCart && (e.target.style.background = '#0056b3')}
            onMouseOut={e => !isInCart && (e.target.style.background = '#007bff')}
          >
            {isInCart ? 'Added to Cart' : 'Add to Cart'}
          </button>

          <Link 
            to="/" 
            style={{ 
              color: '#007bff', 
              fontSize: '1.1rem', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            ← Back to Products
          </Link>
        </div>

        {/* Optional: Show success message */}
        {isInCart && (
          <p style={{ 
            color: '#28a745', 
            fontWeight: 'bold', 
            marginTop: '1rem',
            fontSize: '1.1rem'
          }}>
            This item is in your cart!
          </p>
        )}
      </div>
    </div>
  );
}