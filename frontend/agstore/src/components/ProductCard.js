import { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import styles from './ProductCard.module.css';
import QuantityCounter from './QuantityCounter';

const ProductCard = ({ product }) => {
  const serverUrl = 'https://ecommerce-backend-production-f46e.up.railway.app';
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [currentStock, setCurrentStock] = useState(0);

  const { cartItems } = useSelector((state) => state.cart);
  const isAnyVariantInCart = cartItems.some((item) => item._id === product._id);
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  useEffect(() => {
    if (selectedSize) {
      const variant = product.variants.find(v => v.size === selectedSize);
      setCurrentStock(variant ? variant.stock : 0);
      setQty(1); 
    } else {
      setCurrentStock(0);
    }
  }, [selectedSize, product.variants]);

  const addToCartHandler = () => {
    if (product.variants.length > 0 && !selectedSize) {
      alert('Please select a size.');
      return;
    }
    const itemToAdd = selectedSize 
      ? { ...product, size: selectedSize, qty } 
      : { ...product, qty };
      
    dispatch(addToCart(itemToAdd));
    setSelectedSize(null);
    setQty(1);
  };

  return (
    <div className={`${styles.card} d-flex`}>
      <div className={styles.imageWrapper}>
        <Link to={`/product/${product._id}`}>
          <img src={`${serverUrl}${product.image}`} alt={product.name} className={styles.productImage} />
        </Link>
        {product.variants && product.variants.length > 0 && totalStock > 0 && (
          <div className={styles.sizeSelector}>
            {product.variants.map((variant) => (
              variant.stock > 0 && (
                <button
                  key={variant.size}
                  className={`${styles.sizeButton} ${selectedSize === variant.size ? styles.selected : ''}`}
                  onClick={() => setSelectedSize(variant.size)}
                >
                  {variant.size}
                </button>
              )
            ))}
          </div>
        )}
      </div>
      <div className={styles.infoWrapper}>
        <Link to={`/product/${product._id}`} className={styles.productName}>{product.name}</Link>
        <p className={styles.subCategory}>{product.subCategory}</p>
        <p className={styles.price}>PKR {product.price}</p>
        <div className={styles.actionWrapper}>
          {isAnyVariantInCart ? (
              <Link to="/cart">
                  <Button variant='success' className='w-100'>View in Cart</Button>
              </Link>
          ) : totalStock > 0 ? (
            <Row className="g-2">
              <Col xs={5}>
                <QuantityCounter value={qty} setValue={setQty} max={currentStock} />
              </Col>
              <Col xs={7}>
                <Button variant="dark" className="w-100" disabled={!selectedSize || currentStock === 0} onClick={addToCartHandler}>
                  Add to Cart
                </Button>
              </Col>
            </Row>
          ) : (
            <Button variant="secondary" className="w-100" disabled>Out of Stock</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;