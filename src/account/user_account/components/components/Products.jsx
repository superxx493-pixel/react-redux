import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../fetures/cart/cartSlice';

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

  const totalCartItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

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
        let res;
        if (editingId) {
          res = await axios.put(`https://fakestoreapi.com/products/${editingId}`, v);
          setData(prev => prev.map(p => p.id === editingId ? { ...p, ...res.data } : p));
        } else {
          res = await axios.post('https://fakestoreapi.com/products', v);
          setData(prev => [...prev, { ...res.data, id: Date.now() }]);
        }
        resetForm();
        setShowForm(false);
        setEditingId(null);
      } catch (e) {
        console.error(e);
        alert('Save failed (fake API may not persist changes)');
      } finally {
        setLoading(l => ({ ...l, submit: false }));
      }
    }
  });

  useEffect(() => {
    if (editingId && showForm) {
      const productToEdit = data.find(p => p.id === editingId);
      if (productToEdit) {
        formik.setValues({
          title: productToEdit.title,
          price: productToEdit.price,
          image: productToEdit.image,
          category: productToEdit.category
        });
      }
    } else if (!showForm) {
      formik.resetForm();
    }
  }, [editingId, showForm, data]);

  const handleDelete = async id => {
    if (!confirm('Delete permanently?')) return;
    setLoading(l => ({ ...l, [id]: true }));
    try {
      await axios.delete(`https://fakestoreapi.com/products/${id}`);
      setData(p => p.filter(x => x.id !== id));
    } catch {
      alert('Delete failed (fake API)');
    } finally {
      setLoading(l => ({ ...l, [id]: false }));
    }
  };

  return (
    <>
      {/* Header with Cart Count */}
      <header style={{
        background: '#2874f0',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.8rem', fontWeight: 'bold' }}>
            MyStore
          </Link>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              placeholder="Search products..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ padding: '10px', width: 280, borderRadius: 6, border: 'none', outline: 'none' }}
            />
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(1); }}
              style={{ padding: '10px', borderRadius: 6, border: 'none' }}
            >
              <option value="title">Sort by Title</option>
              <option value="price">Sort by Price</option>
            </select>
            <button
              onClick={() => { setEditingId(null); formik.resetForm(); setShowForm(true); }}
              style={{ padding: '10px 20px', background: '#ff9f00', border: 'none', borderRadius: 6, color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
            >
              + Create New
            </button>
          </div>
        </div>

        <Link to="/cart" style={{ color: 'white', textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.8rem' }}>Cart</span>
          {totalCartItems > 0 && (
            <span style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              background: '#ff3b30',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {totalCartItems}
            </span>
          )}
        </Link>
      </header>

      {/* Main Content */}
      <div style={{ padding: '2rem' }}>
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

      {/* After the product grid and before pagination */}
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', minHeight: '400px' }}>
  {paginated.length > 0 ? (
    paginated.map(p => (
      <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
        <Link to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <img src={p.image} alt={p.title} width={130} style={{ height: 150, objectFit: 'contain' }} />
          <h4 style={{ margin: '0.5rem 0' }}>{p.title.slice(0, 40)}...</h4>
          <p style={{ fontWeight: 'bold', color: '#2c3e50' }}>${p.price}</p>
        </Link>
        <div style={{ marginTop: '1rem', display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => dispatch(addToCart(p))} 
            style={{ 
              padding: '8px 14px', 
              background: inCart(p.id) ? '#28a745' : '#007bff', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 4, 
              fontSize: '.9rem',
              fontWeight: 'bold'
            }}
          >
            {inCart(p.id) ? 'Added' : 'Add'}
          </button>
          <button onClick={() => { setEditingId(p.id); setShowForm(true); }} style={{ padding: '8px 14px', background: '#ffc107', color: '#212529', border: 'none', borderRadius: 4, fontSize: '.9rem' }}>Edit</button>
          <button onClick={() => handleDelete(p.id)} disabled={loading[p.id]} style={{ padding: '8px 14px', background: loading[p.id] ? '#6c757d' : '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, fontSize: '.9rem' }}>
            {loading[p.id] ? '...' : 'Delete'}
          </button>
        </div>
      </div>
    ))
  ) : (
    /* No Results Message */
    <div style={{
      gridColumn: '1 / -1',
      textAlign: 'center',
      padding: '4rem 2rem',
      color: '#666'
    }}>
      <div style={{
        fontSize: '4rem',
        marginBottom: '1rem',
        opacity: 0.3
      }}>Searching...</div>
      <h2 style={{ fontSize: '1.8rem', margin: '1rem 0', color: '#333' }}>
        No products found for "<strong>{search}</strong>"
      </h2>
      <p style={{ fontSize: '1.1rem', color: '#777', maxWidth: 500, margin: '0 auto' }}>
        Try searching with different keywords or check for typos.
      </p>
      <button
        onClick={() => {
          setSearch('');
          setPage(1);
        }}
        style={{
          marginTop: '1.5rem',
          padding: '12px 24px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Clear Search
      </button>
    </div>
  )}
</div>

        {/* Improved Pagination with Prev/Next */}
        {totalPages > 1 && (
          <div style={{ textAlign: 'center', marginTop: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Previous Button */}
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '10px 18px',
                background: page === 1 ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              ← Previous
            </button>

            {/* Page Numbers */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  style={{
                    padding: '10px 14px',
                    background: page === i + 1 ? '#007bff' : '#f0f0f0',
                    color: page === i + 1 ? 'white' : '#333',
                    border: 'none',
                    borderRadius: 6,
                    minWidth: '44px',
                    fontWeight: page === i + 1 ? 'bold' : 'normal'
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: '10px 18px',
                background: page === totalPages ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}