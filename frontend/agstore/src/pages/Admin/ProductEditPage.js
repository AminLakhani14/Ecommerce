import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useGetProductDetailsQuery, useUpdateProductMutation } from '../../redux/slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import FormContainer from '../../components/FormContainer';
import { FaPlus, FaTrash } from 'react-icons/fa';

const ProductEditPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    // State for all product fields
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Men');
    const [subCategory, setSubCategory] = useState('Perfume');
    const [countInStock, setCountInStock] = useState(0);
    const [isOnSale, setIsOnSale] = useState(false);
    const [variants, setVariants] = useState([{ size: '', stock: 0 }]);

    const subCategoryOptions = [
        'Perfume', 'T-shirt', 'Shoes', 'Bags', 
        'Underwear & Basics', 'Jackets', 'Cargo Pants', 'Shorts'
    ];
    // Get the product data using its ID
    const { data: product, isLoading, error: fetchError } = useGetProductDetailsQuery(productId);
    
    // Get the mutation hook for updating
    const [updateProduct, { isLoading: loadingUpdate, error: updateError }] = useUpdateProductMutation();

    
    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };
    
    const addVariant = () => {
        setVariants([...variants, { size: '', stock: 0 }]);
    };

    const removeVariant = (index) => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
    };

    // useEffect to populate the form once the product data is fetched
    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setCategory(product.category);
            setSubCategory(product.subCategory);
            setIsOnSale(product.isOnSale);
            setVariants(product.variants.length > 0 ? product.variants : [{ size: '', stock: 0 }]);
        }
    }, [product]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
          const updatedProductData = {
            productId, // This is used by RTK Query to build the URL
            name,
            price,
            description,
            category,
            subCategory,
            isOnSale,
            variants, // This is the body of the request
          };
    
          await updateProduct(updatedProductData).unwrap();
          
          alert('Product updated successfully');
          navigate('/admin/productlist');
        } catch (err) {
          alert(err?.data?.message || err.error || 'Failed to update product.');
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

                            <Form.Group controlId='variants' className='my-4 p-3 border rounded'>
                                <Form.Label className="fw-bold">Variants (Size & Stock)</Form.Label>
                                {variants.map((variant, index) => (
                                    <Row key={index} className="mb-2 align-items-center">
                                        <Col>
                                            <Form.Control type='text' placeholder="Size (e.g., M, 100ml, 42)" value={variant.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} required />
                                        </Col>
                                        <Col>
                                            <Form.Control type='number' placeholder="Stock" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))} required />
                                        </Col>
                                        <Col xs="auto">
                                            <Button variant="danger" onClick={() => removeVariant(index)} disabled={variants.length === 1}>
                                                <FaTrash />
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Button variant="outline-primary" onClick={addVariant} className="mt-2">
                                    <FaPlus /> Add Variant
                                </Button>
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