import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../slices/productsSlice';
import { addToCart } from '../slices/cartSlice';

export default function Product() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(s => s.products.list.find(p => p.id === +id));

  useEffect(() => {
    if (!product) {
      dispatch(fetchProducts());
    }
  }, [dispatch, id, product]);

  if (!product) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/">← Back to Products</Link>

      <div style={{ marginTop: '20px' }}>
        <img
          src={product.image}
          alt={product.title}
          style={{ maxWidth: '200px', display: 'block', marginBottom: '10px' }}
        />

        <h2>{product.title}</h2>

        <p>Price: ${product.price}</p>

        <p>{product.description}</p>

        <button onClick={() => dispatch(addToCart(product))}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
