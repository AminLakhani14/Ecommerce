import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import { useGetProductDetailsQuery, useUpdateProductMutation } from '../../redux/slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import FormContainer from '../../components/FormContainer';

const ProductEditPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    // State for all product fields
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Men');
    const [subCategory, setSubCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [isOnSale, setIsOnSale] = useState(false);

    // Get the product data using its ID
    const { data: product, isLoading, error: fetchError } = useGetProductDetailsQuery(productId);
    
    // Get the mutation hook for updating
    const [updateProduct, { isLoading: loadingUpdate, error: updateError }] = useUpdateProductMutation();

    // useEffect to populate the form once the product data is fetched
    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setCategory(product.category);
            setSubCategory(product.subCategory);
            setCountInStock(product.countInStock);
            setIsOnSale(product.isOnSale);
        }
    }, [product]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateProduct({ 
                productId, 
                name, 
                price, 
                description, 
                category, 
                subCategory, 
                countInStock, 
                isOnSale 
            }).unwrap();
            
            alert('Product updated successfully');
            navigate('/admin/productlist');
        } catch (err) {
            alert(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <Link to='/' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <Card className="p-4 shadow-sm">
                    <h1 className="mb-4">Edit Product</h1>
                    {loadingUpdate && <Loader />}
                    {updateError && <Message variant='danger'>{updateError.data?.message || updateError.error}</Message>}

                    {isLoading ? <Loader /> : fetchError ? (
                        <Message variant='danger'>{fetchError.data?.message || fetchError.error}</Message>
                    ) : (
                        <Form onSubmit={submitHandler}>
                            {/* --- START: ALL FORM FIELDS --- */}
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
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId='subCategory' className='my-3'>
                                <Form.Label>Sub-Category</Form.Label>
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

                            <Form.Group controlId='isOnSale' className='my-3'>
                                <Form.Check type='checkbox' label='On Sale' checked={isOnSale} onChange={(e) => setIsOnSale(e.target.checked)} />
                            </Form.Group>
                            {/* --- END: ALL FORM FIELDS --- */}

                            <Button type='submit' variant='primary' className="w-100 mt-3" disabled={loadingUpdate}>
                                Update
                            </Button>
                        </Form>
                    )}
                </Card>
            </FormContainer>
        </>
    );
};

export default ProductEditPage;