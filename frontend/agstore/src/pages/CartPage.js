import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import QuantityCounter from '../components/QuantityCounter'; // <-- IMPORT THE NEW COMPONENT

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const serverUrl = 'http://localhost:5000';

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Handler for the counter in the cart
  const updateQuantityHandler = (product, newQty) => {
    dispatch(addToCart({ ...product, qty: newQty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <Row className="my-5">
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row className="align-items-center">
                  <Col md={2}>
                    <Image src={`${serverUrl}${item.image}`} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>PKR {item.price}</Col>
                  <Col md={3}>
                    {/* --- START: NEW UI WITH COUNTER --- */}
                    <QuantityCounter 
                      value={item.qty}
                      setValue={(newQty) => updateQuantityHandler(item, newQty)}
                      max={item.countInStock}
                    />
                    {/* --- END: NEW UI WITH COUNTER --- */}
                  </Col>
                  <Col md={2} className="text-end">
                    <Button type='button' variant='light' onClick={() => removeFromCartHandler(item._id)}>
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
              </h2>
              PKR {cart.itemsPrice}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='w-100'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartPage;