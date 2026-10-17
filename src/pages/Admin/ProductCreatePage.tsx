import { getErrorMessage } from '../../utils/getErrorMessage';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useCreateProductMutation } from '../../redux/slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import FormContainer from '../../components/FormContainer';
import MessageModal from '../../components/MessageModal';

const ProductCreatePage = () => {
    // State for all product fields
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [price, setPrice] = useState(0);
    const [gallery, setGallery] = useState<File[]>([]);
    const [category, setCategory] = useState('Men'); 
    
    const [subCategory, setSubCategory] = useState('Perfume'); 
    
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [isOnSale, setIsOnSale] = useState(false);
    const [variants, setVariants] = useState([{ size: '', stock: 0 }]);
    const subCategoryOptions = [
        'Perfume', 'T-shirt', 'Shoes', 'Bags', 
        'Underwear & Basics', 'Jackets', 'Cargo Pants', 'Shorts', 'Backpacks', 'Shirts', 'Dresses', 'Watches', 'Sunglasses'
    ];

    const navigate = useNavigate();
    const [createProduct, { isLoading, error }] = useCreateProductMutation();

    const [modalShow, setModalShow] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const showModal = (title: string, message: string, success = false) => {
        setModalTitle(title);
        setModalMessage(message);
        setIsSuccess(success);
        setModalShow(true);
    };

    const handleModalClose = () => {
        setModalShow(false);
        if (isSuccess) {
            navigate('/admin/productlist');
        }
    };

    const handleVariantChange = (index: number, field: 'size' | 'stock', value: string | number) => {
        const newVariants = [...variants];
        if (field === 'stock') newVariants[index].stock = Number(value);
        else newVariants[index].size = String(value);
        setVariants(newVariants);
    };
    
    const addVariant = () => {
        setVariants([...variants, { size: '', stock: 0 }]);
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        if (imageUrl.trim()) formData.append('imageUrl', imageUrl.trim());
        formData.append('price', String(price));
        formData.append('description', description);
        formData.append('category', category);
        formData.append('subCategory', subCategory);
        formData.append('countInStock', String(countInStock));
        formData.append('isOnSale', String(isOnSale));
        formData.append('variants', JSON.stringify(variants));

        for (let i = 0; i < gallery.length; i++) {
            formData.append('gallery', gallery[i]);
        }

        try {
            await createProduct(formData).unwrap();
            showModal('Success', 'Product created successfully', true);
        } catch (err) {
            showModal('Error', getErrorMessage(err) || 'Failed to create product');
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
                {error && <Message variant='danger'>{getErrorMessage(error)}</Message>}
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
                            <option value="Backpacks">Backpacks</option>
                            <option value="Clothing">Clothing</option>
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
                        <Form.Control type='number' value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
                    </Form.Group>

                    <Form.Group controlId='countInStock' className='my-3'>
                        <Form.Label>Count In Stock</Form.Label>
                        <Form.Control type='number' value={countInStock} onChange={(e) => setCountInStock(Number(e.target.value))} required />
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

                    <Form.Group controlId='imageUrl' className='my-3'>
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control type='url' placeholder='https://example.com/product.jpg' value={imageUrl} onChange={e => setImageUrl(e.target.value)} required={gallery.length === 0} />
                        <Form.Text className='text-muted'>Use an image URL or upload images below.</Form.Text>
                    </Form.Group>
                    <Form.Group controlId='gallery' className='my-3'>
                        <Form.Label>Product Images (First image is main)</Form.Label>
                        <Form.Control type='file' multiple onChange={(e) => setGallery(Array.from((e.target as HTMLInputElement).files || []))} required={!imageUrl.trim()} />
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
        <MessageModal
            show={modalShow}
            onHide={handleModalClose}
            title={modalTitle}
            message={modalMessage}
        />
        </>
    );
};

export default ProductCreatePage;