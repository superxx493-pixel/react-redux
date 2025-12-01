import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../features/cart/cartSlice';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const items = useSelector(s => s.cart.items);
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => sortBy === 'price' ? a.price - b.price : a.title.localeCompare(b.title));
  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2);

  if (!items.length) return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <h1>Your Cart is Empty</h1>
      <Link to="/" style={{ color: '#007bff', fontSize: '1.2rem' }}>Continue Shopping</Link>
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
      <h1>My Cart ({items.length} items)</h1>

      <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Search in cart..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ padding: 10, width: 300, borderRadius: 4, border: '1px solid #ddd' }} />
        <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} style={{ padding: 10, borderRadius: 4, border: '1px solid #ddd' }}>
          <option value="title">Sort by Title</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>

      {paginated.map(i => (
        <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #ddd', borderRadius: 8, padding: '1rem', marginBottom: '1rem', background: '#fff' }}>
          <img src={i.image} alt={i.title} width={80} height={80} style={{ objectFit: 'contain' }} />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>{i.title}</h3>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#2c3e50' }}>
              ${i.price.toFixed(2)} × {i.quantity} = <span style={{ color: '#e67e22' }}>${(i.price * i.quantity).toFixed(2)}</span>
            </p>
          </div>
          <button onClick={() => dispatch(removeFromCart(i.id))} style={{ padding: '10px 18px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>
            Remove
          </button>
        </div>
      ))}

      <div style={{ textAlign: 'right', fontSize: '1.4rem', fontWeight: 'bold', margin: '1rem 0', color: '#27ae60' }}>
        Total: ${totalAmount}
      </div>

      {totalPages > 1 && (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => setPage(i + 1)} style={{ margin: '0 5px', padding: '10px 14px', background: page === i + 1 ? '#3498db' : '#eee', color: page === i + 1 ? 'white' : 'black', border: 'none', borderRadius: 6 }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '2rem', color: '#3498db', fontSize: '1.1rem', textDecoration: 'none' }}>
        Back to Products
      </Link>
    </div>
  );
}