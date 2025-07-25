import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Button, Card, Container } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import QuantityCounter from '../components/QuantityCounter';
import styles from './styles/CartPage.module.css'; 

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const serverUrl = 'https://ecommerce-backend-production-f46e.up.railway.app';

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const updateQuantityHandler = (product, newQty) => {
    dispatch(addToCart({ ...product, qty: newQty }));
  };

  const removeFromCartHandler = (id, size) => {
    dispatch(removeFromCart({ id, size }));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to='/'>Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map((item) => (
                <ListGroup.Item key={`${item._id}-${item.size}`} className="px-0">
                  <div className={styles.cartItem}>
                    {/* Image */}
                    <img src={`${serverUrl}${item.image}`} alt={item.name} className={styles.productImage} />
                    
                    {/* Product Info */}
                    <div className={styles.productInfo}>
                      <Link to={`/product/${item._id}`} className={styles.productName}>{item.name}</Link>
                      <div className={styles.productDetails}>
                        <span>Size: {item.size}</span>
                        <span className="mx-2">|</span>
                        <span>Price: PKR {item.price}</span>
                      </div>
                      <div style={{ maxWidth: '150px' }} className="mt-2">
                         <QuantityCounter 
                            value={item.qty}
                            setValue={(newQty) => updateQuantityHandler(item, newQty)}
                            max={item?.variants?.find(v => v.size === item.size)?.stock || 0}
                         />
                      </div>
                    </div>

                    <div className="text-end">
                      <h5 className={styles.productPrice}>PKR {item.price * item.qty}</h5>
                      <Button 
                        type='button' 
                        variant='light' 
                        onClick={() => removeFromCartHandler(item._id, item.size)}
                      >
                        <FaTrash style={{ color: '#6c757d' }} />
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col md={4}>
          <Card className={styles.summaryCard}>
            <Card.Body>
              <Card.Title as="h2" className="mb-4">
                Order Summary
              </Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                  <strong>PKR {cart.itemsPrice}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Shipping</span>
                  <strong>PKR {cart.shippingPrice}</strong>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between h5 mt-3">
                  <strong>Total</strong>
                  <strong>PKR {cart.totalPrice}</strong>
                </ListGroup.Item>
                <ListGroup.Item>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type='button'
                      className='mt-3'
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                    >
                      Proceed To Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;