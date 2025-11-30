import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, sortCart } from '../slices/cartSlice';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 5;

export default function Cart() {
  const dispatch = useDispatch();
  const { items } = useSelector(s => s.cart);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');

  const filtered = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalItems = items.reduce((a, i) => a + i.quantity, 0);
  const totalPrice = items.reduce((a, i) => a + (i.price * i.quantity), 0).toFixed(2);

  return (
    <div style={{padding:'30px', maxWidth:'1000px', margin:'0 auto', fontFamily:'Arial, sans-serif'}}>
      
      <h1 style={{textAlign:'center', color:'#333', marginBottom:'20px'}}>My Cart ({totalItems} items)</h1>

      {/* Back + Search + Sort */}
      <div style={{marginBottom:'25px', display:'flex', gap:'15px', flexWrap:'wrap', alignItems:'center'}}>
        <Link to="/" style={{color:'#007bff', textDecoration:'none', fontSize:'16px'}}>
          ← Continue Shopping
        </Link>

        <input 
          placeholder="Search in cart..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          style={{padding:'10px', width:'280px', borderRadius:'8px', border:'1px solid #ccc', fontSize:'16px'}}
        />

        <select value={sortField} onChange={e => setSortField(e.target.value)}
          style={{padding:'10px', borderRadius:'8px', border:'1px solid #ccc'}}>
          <option value="price">Price</option>
          <option value="title">Title</option>
        </select>

        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}
          style={{padding:'10px', borderRadius:'8px', border:'1px solid #ccc'}}>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>

        <button onClick={() => dispatch(sortCart({ field: sortField, order: sortOrder }))}
          style={{background:'#007bff', color:'white', border:'none', padding:'10px 20px', borderRadius:'8px', cursor:'pointer'}}>
          Apply Sort
        </button>
      </div>

      {/* Cart Items */}
      {paginated.length === 0 ? (
        <div style={{textAlign:'center', padding:'60px', background:'#f8f9fa', borderRadius:'12px', color:'#666'}}>
          <h2>Your cart is empty</h2>
          <Link to="/" style={{color:'#007bff', fontSize:'18px'}}>Start Shopping →</Link>
        </div>
      ) : (
        <div style={{background:'white', borderRadius:'15px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', overflow:'hidden'}}>
          {paginated.map(i => (
            <div key={i.id} style={{
              display:'flex', alignItems:'center', gap:'20px', padding:'20px', borderBottom:'1px solid #eee'
            }}>
              <img src={i.image} alt={i.title} style={{width:'80px', height:'80px', objectFit:'contain'}} />
              
              <div style={{flex:'1'}}>
                <h3 style={{margin:'0 0 8px 0', fontSize:'18px'}}>{i.title}</h3>
                <p style={{margin:0, color:'#666'}}>Quantity: <strong>{i.quantity}</strong></p>
              </div>

              <div style={{textAlign:'right'}}>
                <p style={{fontSize:'20px', fontWeight:'bold', color:'#28a745', margin:'0 0 10px 0'}}>
                  ${(i.price * i.quantity).toFixed(2)}
                </p>
                <button 
                  onClick={() => dispatch(removeFromCart(i.id))}
                  style={{background:'#dc3545', color:'white', border:'none', padding:'8px 16px', borderRadius:'6px', cursor:'pointer'}}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total + Pagination */}
      {paginated.length > 0 && (
        <>
          <div style={{marginTop:'25px', textAlign:'right', fontSize:'22px', fontWeight:'bold', color:'#333'}}>
            Total: <span style={{color:'#28a745'}}>${totalPrice}</span>
          </div>

          <div style={{textAlign:'center', marginTop:'30px'}}>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              style={{padding:'10px 20px', margin:'0 10px', borderRadius:'8px', border:'1px solid #ccc'}}>
              Previous
            </button>
            <span style={{fontSize:'18px', margin:'0 20px'}}>Page {page}</span>
            <button disabled={page * PAGE_SIZE >= filtered.length} onClick={() => setPage(p => p + 1)}
              style={{padding:'10px 20px', margin:'0 10px', borderRadius:'8px', border:'1px solid #ccc'}}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}