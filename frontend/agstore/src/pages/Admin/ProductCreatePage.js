import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useCreateProductMutation } from '../../redux/slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import FormContainer from '../../components/FormContainer';

const ProductCreatePage = () => {
    // State for all product fields
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [gallery, setGallery] = useState([]);
    const [category, setCategory] = useState('Men'); 
    
    const [subCategory, setSubCategory] = useState('Perfume'); 
    
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [isOnSale, setIsOnSale] = useState(false);
    const [variants, setVariants] = useState([{ size: '', stock: 0 }]);
    const subCategoryOptions = [
        'Perfume', 'T-shirt', 'Shoes', 'Bags', 
        'Underwear & Basics', 'Jackets', 'Cargo Pants', 'Shorts'
    ];

    const navigate = useNavigate();
    const [createProduct, { isLoading, error }] = useCreateProductMutation();

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };
    
    const addVariant = () => {
        setVariants([...variants, { size: '', stock: 0 }]);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('subCategory', subCategory);
        formData.append('countInStock', countInStock);
        formData.append('isOnSale', isOnSale);
        formData.append('variants', JSON.stringify(variants));

        for (let i = 0; i < gallery.length; i++) {
            formData.append('gallery', gallery[i]);
        }

        try {
            await createProduct(formData).unwrap();
            alert('Product created successfully');
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
                <h1 className="mb-4">Create Product</h1>
                {isLoading && <Loader />}
                {error && <Message variant='danger'>{error?.data?.message || error.error}</Message>}
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
                            <option value="Accessories">Accessories</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId='subCategory' className='my-3'>
                        <Form.Label>Sub-Category</Form.Label>
                        <Form.Select value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                            {subCategoryOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId='price' className='my-3'>
                        <Form.Label>Price</Form.Label>
                        <Form.Control type='number' value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </Form.Group>

                    <Form.Group controlId='countInStock' className='my-3'>
                        <Form.Label>Count In Stock</Form.Label>
                        <Form.Control type='number' value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
                    </Form.Group>

                    <Form.Group controlId='variants' className='my-3'>
                        <Form.Label>Variants (Size & Stock)</Form.Label>
                        {variants.map((variant, index) => (
                            <Row key={index} className="mb-2">
                                <Col><Form.Control type='text' placeholder="Size (e.g., M, 100ml, 42)" value={variant.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} /></Col>
                                <Col><Form.Control type='number' placeholder="Stock" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', e.target.value)} /></Col>
                            </Row>
                        ))}
                        <Button variant="outline-secondary" onClick={addVariant}>Add Variant</Button>
                    </Form.Group>

                    <Form.Group controlId='gallery' className='my-3'>
                        <Form.Label>Product Images (First image is main)</Form.Label>
                        <Form.Control type='file' multiple onChange={(e) => setGallery(e.target.files)} required />
                    </Form.Group>

                    <Form.Group controlId='isOnSale' className='my-3'>
                        <Form.Check type='checkbox' label='On Sale' checked={isOnSale} onChange={(e) => setIsOnSale(e.target.checked)} />
                    </Form.Group>
                    
                    <Button type='submit' variant='dark' className='mt-3 w-100' disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create Product'}
                    </Button>
                </Form>
            </Card>
        </FormContainer>
        </>
    );
};

export default ProductCreatePage;