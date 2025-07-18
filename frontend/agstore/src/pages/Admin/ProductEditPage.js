import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useGetProductDetailsQuery, useUpdateProductMutation } from '../../redux/slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import FormContainer from '../../components/FormContainer';

const ProductEditPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [isOnSale, setIsOnSale] = useState(false);

    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();

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
            await updateProduct({ productId, name, price, description, category, subCategory, countInStock, isOnSale });
            alert('Product updated successfully');
            navigate('/admin/productlist');
        } catch (err) {
            alert(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>Go Back</Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {isLoading ? <Loader /> : error ? <Message variant='danger'>{error.data.message}</Message> : (
                    <Form onSubmit={submitHandler}>
                        {/* Form fields for Name, Price, etc. similar to Create Page */}
                        <Form.Group controlId='isOnSale' className='my-3'>
                            <Form.Check type='checkbox' label='On Sale' checked={isOnSale} onChange={(e) => setIsOnSale(e.target.checked)} />
                        </Form.Group>
                        <Button type='submit' variant='primary'>Update</Button>
                    </Form>
                )}
            </FormContainer>
        </>
    );
};
export default ProductEditPage;