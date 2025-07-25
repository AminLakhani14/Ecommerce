import { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Image, Card, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import { useCreateOrderMutation } from '../redux/slices/orderApiSlice';
import { clearCartItems } from '../redux/slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import styles from './styles/ShippingPage.module.css'; // <-- Import the new stylesheet

const ShippingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const serverUrl = 'https://ecommerce-backend-production-f46e.up.railway.app';

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems } = cart;

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState(shippingAddress?.state || 'Sindh');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  const paymentMethod = 'Cash on Delivery'; // Fixed as per previous request

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems, navigate]);
  
  const placeOrderHandler = async (e) => {
    e.preventDefault();
    try {
      const fullShippingAddress = { email, firstName, lastName, phone, address, city, state, postalCode, country: 'Pakistan' };
      dispatch(saveShippingAddress(fullShippingAddress));
      
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: fullShippingAddress,
        paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}/thankyou`);
    } catch (err) {
      alert(err.data?.message || err.error || 'An unexpected error occurred.');
    }
  };

  return (
    <Container className="my-5">
      <Row>
        <Col md={7} className="pe-md-5">
          {/* <CheckoutSteps step1 step2 /> */}
          <Form onSubmit={placeOrderHandler}>
            <div className={styles.formSection}>
              <h2 className={styles.formLabel}>Contact</h2>
              <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.formLabel}>Shipping Information</h2>
              <Row className="mb-3">
                <Col><Form.Control placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /></Col>
                <Col><Form.Control placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required /></Col>
              </Row>
              <Form.Group className="mb-3"><Form.Control placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required /></Form.Group>
              <Row className="mb-3">
                <Col><Form.Control placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required /></Col>
                <Col><Form.Control placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required /></Col>
              </Row>
              <Row className="mb-3">
                <Col><Form.Select value={state} onChange={(e) => setState(e.target.value)}>
                    <option>Sindh</option>
                    <option>Punjab</option>
                    <option>KPK</option>
                    <option>Balochistan</option>
                    <option>Kashmir</option>
              </Form.Select></Col>
                <Col><Form.Control value="Pakistan" readOnly disabled /></Col>
              </Row>
              <Form.Control type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.formLabel}>Payment</h2>
              <p className="text-muted small">All transactions are secure and encrypted.</p>
              <div className={`${styles.paymentOption} ${styles.selected}`}>
                <Form.Check type="radio" id="cod" value="Cash on Delivery" checked readOnly label={<div className="fw-bold">Cash on Delivery (COD)</div>} />
              </div>
            </div>
            
            <div className="d-grid mt-4">
              <Button type="submit" variant="dark" size="lg" disabled={isLoading}>
                {isLoading ? <Loader /> : 'Complete Order'}
              </Button>
            </div>
            {error && <Message variant='danger' className="mt-3">{error.data?.message || error.error}</Message>}
          </Form>
        </Col>

        <Col md={5}>
          <Card className={styles.summaryCard}>
            <Card.Body className="p-4">
              <h4 className="mb-4">Order Summary</h4>
              {cartItems.map(item => (
                <Row key={item._id} className="mb-3 align-items-center">
                  <Col xs={3}><Image src={`${serverUrl}${item.image}`} thumbnail /></Col>
                  <Col xs={6}><div>{item.name}</div><small className="text-muted">Qty: {item.qty}</small></Col>
                  <Col xs={3} className="text-end fw-bold">PKR {item.price * item.qty}</Col>
                </Row>
              ))}
              <hr />
              <div className={styles.summaryItem}><span>Subtotal</span><span>PKR {cart.itemsPrice}</span></div>
              <div className={styles.summaryItem}><span>Shipping</span><span>PKR {cart.shippingPrice}</span></div>
              <div className={`${styles.summaryItem} ${styles.summaryTotal}`}><span>Total</span><span>PKR {cart.totalPrice}</span></div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ShippingPage;