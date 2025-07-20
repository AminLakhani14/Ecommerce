import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import QuantityCounter from './QuantityCounter';
import styles from './QuantityCounter.module.css'; // <-- Import the styles for the action row

const ProductCard = ({ product }) => {
  const serverUrl = 'http://localhost:5000';
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);

  const { cartItems } = useSelector((state) => state.cart);
  const isItemInCart = cartItems.some((item) => item._id === product._id);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = () => {
    dispatch(removeFromCart(product._id));
  };

  return (
    <Card className='my-3 p-3 rounded shadow-sm h-100'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={`${serverUrl}${product.image}`} variant='top' style={{ height: '200px', objectFit: 'cover' }} />
      </Link>

      <Card.Body className="d-flex flex-column">
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div' className='my-2'>
          {product.countInStock > 0 ? (
            <span className="text-success">In Stock: {product.countInStock}</span>
          ) : (
            <span className="text-danger">Out of Stock</span>
          )}
        </Card.Text>

        <Card.Text as='h3'>PKR {product.price}</Card.Text>

        <div className="mt-auto">
          {isItemInCart ? (
            <Button variant='danger' className='w-100' onClick={removeFromCartHandler}>
              Remove from Cart
            </Button>
          ) : product.countInStock > 0 ? (
            // --- START: NEW CLEANED-UP UI ---
            <div className={styles.actionRow}>
              <QuantityCounter 
                value={qty} 
                setValue={setQty} 
                max={product.countInStock} 
              />
              <Button 
                variant='dark' 
                className={styles.addToCartButton} 
                onClick={addToCartHandler}
              >
                Add to Cart
              </Button>
            </div>
            // --- END: NEW CLEANED-UP UI ---
          ) : (
            <Button variant='light' className='w-100' disabled>
              Out of Stock
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;