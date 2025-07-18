import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, productCreateReset } from '../../redux/slices/productCreateSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import FormContainer from '../../components/FormContainer';

const ProductCreatePage = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [gallery, setGallery] = useState([]);
    const [category, setCategory] = useState('Men');
    const [subCategory, setSubCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [isOnSale, setIsOnSale] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get the state from our new slice
    const { loading, error, success } = useSelector((state) => state.productCreate);

    // This effect runs when the 'success' state changes
    useEffect(() => {
        if (success) {
            alert('Product created successfully');
            dispatch(productCreateReset()); // Reset the state
            navigate('/'); // Navigate to the homepage
        }
    }, [success, navigate, dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('subCategory', subCategory);
        formData.append('countInStock', countInStock);
        formData.append('isOnSale', isOnSale);
        
        for (let i = 0; i < gallery.length; i++) {
            formData.append('gallery', gallery[i]);
        }
        
        // Dispatch the thunk action with the correct formData
        dispatch(createProduct(formData));
    };

    return (
        <FormContainer>
            <Card className="p-4 shadow-sm">
                <h1 className="mb-4">Create Product</h1>
                {loading && <Loader />}
                {/* Now, the error will be displayed correctly */}
                {error && <Message variant='danger'>{error.message || 'An error occurred'}</Message>}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='my-3'>
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control type='text' value={name} onChange={(e) => setName(e.target.value)} required />
                    </Form.Group>

                    <Form.Group controlId='description' className='my-3'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </Form.Group>

                    <Form.Group controlId='category' className='my-3'>
                        <Form.Label>Category</Form.Label>
                        <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Children">Children</option>
                            <option value="Sale">Sale</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId='subCategory' className='my-3'>
                        <Form.Label>Sub-Category (e.g., T-Shirts, Perfumes)</Form.Label>
                        <Form.Control type='text' value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required />
                    </Form.Group>

                    <Form.Group controlId='price' className='my-3'>
                        <Form.Label>Price</Form.Label>
                        <Form.Control type='number' value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </Form.Group>

                    <Form.Group controlId='countInStock' className='my-3'>
                        <Form.Label>Count In Stock</Form.Label>
                        <Form.Control type='number' value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
                    </Form.Group>

                    <Form.Group controlId='gallery' className='my-3'>
                        <Form.Label>Product Images (First image is main)</Form.Label>
                        {/* Removed 'required' from file input for better handling */}
                        <Form.Control type='file' multiple onChange={(e) => setGallery(e.target.files)} />
                    </Form.Group>
                    <Form.Group controlId='isOnSale' className='my-3'>
                        <Form.Check type='checkbox' label='On Sale' checked={isOnSale} onChange={(e) => setIsOnSale(e.target.checked)} />
                    </Form.Group>

                    <Button type='submit' variant='dark' className='mt-3 w-100' disabled={loading}>
                        {loading ? 'Creating...' : 'Create Product'}
                    </Button>
                </Form>
            </Card>
        </FormContainer>
    );
};

export default ProductCreatePage;