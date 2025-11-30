import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createProduct, updateProduct } from '../slices/productsSlice';

const schema = Yup.object({
  title: Yup.string().required('Title is required'),
  price: Yup.number().positive().required('Price must be positive'),
  description: Yup.string().required('Description is required'),
  image: Yup.string().url().required('Valid image URL required'),
  category: Yup.string().required('Category is required'),
});

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = useSelector(s => id ? s.products.list.find(p => p.id === +id) : null);
  const initial = product || { title: '', price: '', description: '', image: '', category: '' };

  return (
    <div style={{padding:'40px', maxWidth:'700px', margin:'0 auto', fontFamily:'Arial, sans-serif'}}>
      
      <h1 style={{textAlign:'center', color:'#333', marginBottom:'30px'}}>
        {id ? 'Edit Product' : 'Add New Product'}
      </h1>

      <div style={{background:'white', padding:'30px', borderRadius:'15px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
        
        <Formik 
          initialValues={initial} 
          validationSchema={schema} 
          enableReinitialize 
          onSubmit={v => {
            if (id) dispatch(updateProduct({ id: +id, p: v }));
            else dispatch(createProduct(v));
            navigate('/');
          }}
        >
          <Form style={{display:'flex', flexDirection:'column', gap:'18px'}}>
            
            <div>
              <Field name="title" placeholder="Product Title" 
                style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #ccc', fontSize:'16px'}} />
              <ErrorMessage name="title" component="div" style={{color:'red', fontSize:'14px', marginTop:'5px'}} />
            </div>

            <div>
              <Field name="price" type="number" placeholder="Price (e.g. 99.99)" 
                style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #ccc', fontSize:'16px'}} />
              <ErrorMessage name="price" component="div" style={{color:'red', fontSize:'14px', marginTop:'5px'}} />
            </div>

            <div>
              <Field name="description" as="textarea" rows="4" placeholder="Product Description" 
                style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #ccc', fontSize:'16px', resize:'vertical'}} />
              <ErrorMessage name="description" component="div" style={{color:'red', fontSize:'14px', marginTop:'5px'}} />
            </div>

            <div>
              <Field name="image" placeholder="Image URL[](https://...)" 
                style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #ccc', fontSize:'16px'}} />
              <ErrorMessage name="image" component="div" style={{color:'red', fontSize:'14px', marginTop:'5px'}} />
            </div>

            <div>
              <Field name="category" placeholder="Category (e.g. electronics)" 
                style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #ccc', fontSize:'16px'}} />
              <ErrorMessage name="category" component="div" style={{color:'red', fontSize:'14px', marginTop:'5px'}} />
            </div>

            <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
              <button type="submit" style={{
                background:'#28a745', color:'white', border:'none', padding:'14px 30px',
                borderRadius:'8px', fontSize:'18px', cursor:'pointer', fontWeight:'bold', flex:'1'
              }}>
                {id ? 'Update Product' : 'Create Product'}
              </button>
              
              <button type="button" onClick={() => navigate('/')} style={{
                background:'#6c757d', color:'white', border:'none', padding:'14px 30px',
                borderRadius:'8px', fontSize:'18px', cursor:'pointer', flex:'1'
              }}>
                Cancel
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}