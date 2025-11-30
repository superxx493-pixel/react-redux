import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, sort } from '../slices/productsSlice';
import { addToCart } from '../slices/cartSlice';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 6;

export default function Products() {
  const dispatch = useDispatch();
  const { list: products, status } = useSelector(s => s.products);
  const cartCount = useSelector(s => s.cart.items.reduce((a, i) => a + i.quantity, 0));
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => { if (status === 'idle') dispatch(fetchProducts()); }, [dispatch, status]);
  useEffect(() => { dispatch(sort({ field: sortField, order: sortOrder })); }, [sortField, sortOrder, dispatch]);

  const filtered = products.filter(p => p?.title?.toLowerCase().includes(search.toLowerCase()));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{padding:'20px', fontFamily:'sans-serif'}}>
      <h1 style={{textAlign:'center', color:'#333'}}>Products</h1>

      <div style={{marginBottom:'20px', textAlign:'center'}}>
        <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{padding:'10px', width:'300px', borderRadius:'6px', border:'1px solid #ccc'}} />
        &nbsp;
        <select value={sortField} onChange={e=>setSortField(e.target.value)}>
          <option value="price">Price</option><option value="title">Title</option>
        </select>
        <select value={sortOrder} onChange={e=>setSortOrder(e.target.value)}>
          <option value="asc">Low → High</option><option value="desc">High → Low</option>
        </select>
        &nbsp;
        <Link to="/add" style={{background:'#28a745',color:'white',padding:'10px 20px',borderRadius:'6px',textDecoration:'none'}}>+ Add</Link>
        &nbsp;
        <Link to="/cart" style={{background:'#007bff',color:'white',padding:'10px 20px',borderRadius:'6px',textDecoration:'none'}}>
          Cart ({cartCount})
        </Link>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))', gap:'20px'}}>
        {paginated.map(p => (
          <div key={p.id} style={{border:'1px solid #eee', borderRadius:'10px', padding:'15px', background:'white', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
            <img src={p.image} alt="" style={{width:'100%', height:'180px', objectFit:'contain'}} />
            <h3 style={{height:'50px', overflow:'hidden', margin:'10px 0', fontSize:'16px'}}>
              <Link to={`/product/${p.id}`} style={{color:'#007bff', textDecoration:'none'}}>{p.title.slice(0,60)}...</Link>
            </h3>
            <p style={{fontSize:'22px', fontWeight:'bold', color:'#28a745', margin:'10px 0'}}>${p.price}</p>
            <div>
              <button onClick={()=>dispatch(addToCart(p))} style={{background:'#007bff', color:'white', border:'none', padding:'8px 16px', borderRadius:'6px', marginRight:'5px'}}>Add to Cart</button>
              <Link to={`/edit/${p.id}`} style={{background:'#ffc107', color:'black', padding:'8px 16px', borderRadius:'6px', textDecoration:'none', marginRight:'5px'}}>Edit</Link>
              <button onClick={()=>dispatch(deleteProduct(p.id))} style={{background:'#dc3545', color:'white', border:'none', padding:'8px 16px', borderRadius:'6px'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{textAlign:'center', marginTop:'30px'}}>
        <button disabled={page===1} onClick={()=>setPage(p=>p-1)} style={{padding:'10px 20px', margin:'0 10px'}}>Previous</button>
        <span style={{fontSize:'18px'}}>Page {page}</span>
        <button disabled={page*PAGE_SIZE >= filtered.length} onClick={()=>setPage(p=>p+1)} style={{padding:'10px 20px', margin:'0 10px'}}>Next</button>
      </div>
    </div>
  );
}