import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';

const schema = Yup.object({
  title: Yup.string().min(3).required(),
  price: Yup.number().positive().required(),
  image: Yup.string().url().required(),
  category: Yup.string().required()
});

export default function Products() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('title');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState({});
  const dispatch = useDispatch();
  const cartItems = useSelector(s => s.cart.items);
  const perPage = 6;

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products').then(r => setData(r.data));
  }, []);

  const filtered = data.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => sort === 'price' ? a.price - b.price : a.title.localeCompare(b.title));
  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);
  const inCart = id => cartItems.some(i => i.id === id);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { title: '', price: '', image: '', category: '' },
    validationSchema: schema,
    onSubmit: async (v, { resetForm }) => {
      setLoading(l => ({ ...l, submit: true }));
      try {
        const res = editingId
          ? await axios.put(`https://fakestoreapi.com/products/${editingId}`, v)
          : await axios.post('https://fakestoreapi.com/products', v);
        setData(prev => editingId
          ? prev.map(p => p.id === editingId ? { ...p, ...res.data } : p)
          : [...prev, { ...res.data, id: Date.now() }]);
        resetForm(); setShowForm(false); setEditingId(null);
      } catch (e) { console.error(e); }
      finally { setLoading(l => ({ ...l, submit: false })); }
    }
  });

  const handleDelete = async id => {
    if (!confirm('Delete permanently?')) return;
    setLoading(l => ({ ...l, [id]: true }));
    try {
      await axios.delete(`https://fakestoreapi.com/products/${id}`);
      setData(p => p.filter(x => x.id !== id));
    } catch { alert('Delete failed (fake API)'); }
    finally { setLoading(l => ({ ...l, [id]: false })); }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Products</h1>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ padding: '8px', width: 250 }} />
        <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
          <option value="title">Title</option>
          <option value="price">Price</option>
        </select>
        <button onClick={() => { setEditingId(null); setShowForm(true); }}>+ Create New</button>
      </div>

      {showForm && (
        <form onSubmit={formik.handleSubmit} style={{ margin: '2rem 0', padding: '1.5rem', border: '2px solid #007bff', borderRadius: 8, background: '#f9f9f9' }}>
          <h3>{editingId ? 'Edit' : 'Create'} Product</h3>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            {['title', 'price', 'image', 'category'].map(f => (
              <div key={f}>
                <input {...formik.getFieldProps(f)} type={f === 'price' ? 'number' : 'text'} placeholder={f[0].toUpperCase() + f.slice(1)} style={{ width: '100%', padding: 8 }} />
                {formik.touched[f] && formik.errors[f] && <div style={{ color: 'red', fontSize: '.9rem' }}>{formik.errors[f]}</div>}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={loading.submit} style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: 4 }}>
              {loading.submit ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => { setEditingId(null); setShowForm(false); formik.resetForm(); }} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: 4 }}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
        {paginated.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
            <Link to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src={p.image} alt={p.title} width={130} style={{ height: 150, objectFit: 'contain' }} />
              <h4 style={{ margin: '0.5rem 0' }}>{p.title.slice(0, 40)}...</h4>
              <p style={{ fontWeight: 'bold', color: '#2c3e50' }}>${p.price}</p>
            </Link>
            <div style={{ marginTop: '1rem', display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => dispatch(addToCart(p))} style={{ padding: '8px 14px', background: inCart(p.id) ? '#28a745' : '#007bff', color: '#fff', border: 'none', borderRadius: 4, fontSize: '.9rem' }}>
                {inCart(p.id) ? 'Added' : 'Add'}
              </button>
              <button onClick={() => { setEditingId(p.id); setShowForm(true); }} style={{ padding: '8px 14px', background: '#ffc107', color: '#212529', border: 'none', borderRadius: 4, fontSize: '.9rem' }}>Edit</button>
              <button onClick={() => handleDelete(p.id)} disabled={loading[p.id]} style={{ padding: '8px 14px', background: loading[p.id] ? '#6c757d' : '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, fontSize: '.9rem' }}>
                {loading[p.id] ? '...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => setPage(i + 1)} style={{ margin: '0 5px', padding: '8px 12px', background: page === i + 1 ? '#007bff' : '#eee', color: page === i + 1 ? '#fff' : '#000', border: 'none', borderRadius: 4 }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}