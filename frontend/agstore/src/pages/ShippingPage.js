import { useState, useEffect } from 'react';
import { Form, Button, Col, Row, ListGroup, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import { useCreateOrderMutation } from '../redux/slices/orderApiSlice';
import { clearCartItems } from '../redux/slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ShippingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const serverUrl = 'http://localhost:5000';

  const cart = useSelector((state) => state.cart);
//   const { shippingAddress, cartItems } = cart;
  const { cartItems } = cart;

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState( '');
  const [lastName, setLastName] = useState( '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Sindh');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  
  const paymentMethod = 'Cash on Delivery';

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
      
      // Since it's COD, we always go to the Thank You page.
      navigate(`/order/${res._id}/thankyou`);

    } catch (err) {
      alert(err.data?.message || err.error || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Row className="my-5">
      <Col md={7} className="pe-md-5">
        {/* <CheckoutSteps step1 step2 /> */}
        <Form onSubmit={placeOrderHandler}>
          <h2 className="mb-3">Contact</h2>
          <Form.Group className="mb-4">
            <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>

          <h2 className="mb-3">Shipping Information</h2>
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
            <Col>
              <Form.Select value={state} onChange={(e) => setState(e.target.value)}>
                <option>Sindh</option>
                <option>Punjab</option>
                <option>KPK</option>
                <option>Balochistan</option>
                <option>Kashmir</option>
              </Form.Select>
            </Col>
            <Col><Form.Control value="Pakistan" readOnly disabled /></Col>
          </Row>
          <Form.Group className="mb-3"><Form.Control type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required /></Form.Group>

          <h2 className="mt-5 mb-3">Payment</h2>
          <p className="text-muted">All transactions are secure and encrypted.</p>
          
          {/* --- START: SIMPLIFIED PAYMENT SECTION --- */}
          <div className="border rounded p-3 bg-light">
            <Form.Check 
              type="radio" 
              id="cod" 
              name="paymentMethod" 
              value="Cash on Delivery" 
              checked={true} // Always checked
              readOnly // User cannot change it
              label={<div className="fw-bold">Cash on Delivery (COD)</div>}
            />
          </div>
          {/* --- END: SIMPLIFIED PAYMENT SECTION --- */}
          
          <div className="d-grid mt-4">
            <Button type="submit" variant="dark" size="lg" disabled={isLoading}>
              {isLoading ? <Loader /> : 'Complete Order'}
            </Button>
          </div>
          {error && <Message variant='danger' className="mt-3">{error.data?.message || error.error}</Message>}
        </Form>
      </Col>

      {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
      <Col md={5} className="bg-light p-4 rounded-3" style={{ borderLeft: '1px solid #dee2e6' }}>
        <h4>Order Summary</h4>
        <hr/>
        {cartItems.length > 0 ? (
          cartItems.map(item => (
              <Row key={item._id} className="mb-3 align-items-center">
                  <Col xs={3}>
                      <Image src={`${serverUrl}${item.image}`} thumbnail style={{border: '1px solid #ddd'}}/>
                  </Col>
                  <Col xs={6}>
                      <div>{item.name}</div>
                      <small className="text-muted">Qty: {item.qty}</small>
                  </Col>
                  <Col xs={3} className="text-end fw-bold">PKR {item.price * item.qty}</Col>
              </Row>
          ))
        ) : (
          <Message>Your cart is empty.</Message>
        )}
        <hr/>
        <ListGroup variant="flush" className="bg-transparent">
          <ListGroup.Item className="d-flex justify-content-between bg-transparent px-0"><span>Subtotal</span><span>PKR {cart.itemsPrice}</span></ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between bg-transparent px-0"><span>Shipping</span><span>PKR {cart.shippingPrice}</span></ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between bg-transparent px-0"><span>Tax (15%)</span><span>PKR {cart.taxPrice}</span></ListGroup.Item>
          <hr/>
          <ListGroup.Item className="d-flex justify-content-between fw-bold h5 bg-transparent px-0">
            <span>Total</span><span>PKR {cart.totalPrice}</span>
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Row>
  );
};

export default ShippingPage;