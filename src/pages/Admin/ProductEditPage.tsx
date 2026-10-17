import { productImageUrl } from '../../utils/productImage';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Image } from 'react-bootstrap';
import { useGetProductDetailsQuery, useUpdateProductMutation } from '../../redux/slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import FormContainer from '../../components/FormContainer';
import MessageModal from '../../components/MessageModal';
import { FaPlus, FaTrash } from 'react-icons/fa';

const ProductEditPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    // State for all product fields
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Men');
    const [subCategory, setSubCategory] = useState('Perfume');
    const [countInStock, setCountInStock] = useState(0);
    const [isOnSale, setIsOnSale] = useState(false);
    const [variants, setVariants] = useState([{ size: '', stock: 0 }]);
    const [gallery, setGallery] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    const subCategoryOptions = [
        'Perfume', 'T-shirt', 'Shoes', 'Bags', 
        'Underwear & Basics', 'Jackets', 'Cargo Pants', 'Shorts', 'Backpacks', 'Shirts', 'Dresses', 'Watches', 'Sunglasses'
    ];
    // Get the product data using its ID
    const { data: product, isLoading, error: fetchError } = useGetProductDetailsQuery(productId);
    
    // Get the mutation hook for updating
    const [updateProduct, { isLoading: loadingUpdate, error: updateError }] = useUpdateProductMutation();

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

    const removeVariant = (index: number) => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
    };

    // useEffect to populate the form once the product data is fetched
    useEffect(() => {
        if (product) {
            setName(product.name);
            setImageUrl(/^https?:\/\//i.test(product.image) ? product.image : '');
            setPrice(product.price);
            setDescription(product.description);
            setCategory(product.category);
            setSubCategory(product.subCategory);
            setIsOnSale(product.isOnSale);
            setVariants(product.variants.length > 0 ? product.variants : [{ size: '', stock: 0 }]);
            setExistingImages([product.image, ...product.gallery].filter(Boolean));
        }
    }, [product]);

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

        if (gallery && gallery.length > 0) {
            for (let i = 0; i < gallery.length; i++) {
                formData.append('gallery', gallery[i]);
            }
        }

        try {
          // RTK Query typically sends JSON by default.
          // Note: updateProduct might need to be adjusted or use raw Fetch/Axios 
          // Send the product ID separately from the multipart form data.
          await updateProduct({ productId, formData }).unwrap();
          showModal('Success', 'Product updated successfully', true);
        } catch (err) {
          showModal('Error', getErrorMessage(err) || 'Failed to update product.');
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
                    {updateError && <Message variant='danger'>{getErrorMessage(updateError)}</Message>}

                    {isLoading ? <Loader /> : fetchError ? (
                        <Message variant='danger'>{getErrorMessage(fetchError)}</Message>
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
                                <Button variant="outline-dark" onClick={addVariant} className="mt-2">
                                    <FaPlus /> Add Variant
                                </Button>
                            </Form.Group>

                            <Form.Group controlId='isOnSale' className='my-3'>
                                <Form.Check type='checkbox' label='On Sale' checked={isOnSale} onChange={(e) => setIsOnSale(e.target.checked)} />
                            </Form.Group>

                            <Form.Group controlId='existingImages' className='my-3'>
                                <Form.Label>Current Images</Form.Label>
                                <div className="d-flex flex-wrap gap-2">
                                    {existingImages.map((img, index) => (
                                        <Image key={index} src={productImageUrl(img)} thumbnail style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                                    ))}
                                </div>
                            </Form.Group>

                            <Form.Group controlId='imageUrl' className='my-3'>
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control type='url' placeholder='https://example.com/product.jpg' value={imageUrl} onChange={e => setImageUrl(e.target.value)}  />
                        <Form.Text className='text-muted'>Use an image URL or upload images below.</Form.Text>
                    </Form.Group>
                    <Form.Group controlId='gallery' className='my-3'>
                                <Form.Label>Change Images (Replace All)</Form.Label>
                                <Form.Control type='file' multiple onChange={(e) => setGallery(Array.from((e.target as HTMLInputElement).files || []))} />
                                <Form.Text className="text-muted small">Choosing new images will replace existing ones.</Form.Text>
                            </Form.Group>
                            {/* --- END: ALL FORM FIELDS --- */}

                            <Button type='submit' variant='dark' className="w-100 mt-3" disabled={loadingUpdate}>
                                Update
                            </Button>
                        </Form>
                    )}
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

export default ProductEditPage;
