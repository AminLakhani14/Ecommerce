import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetOrderDetailsQuery, usePayOrderMutation } from '../redux/slices/orderApiSlice';
import jazzcashLogo from '../assets/images/jazzcash.png';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const onPayWithJazzCash = async () => {
    try {
      await payOrder(orderId).unwrap();
      refetch(); // Refetch the order details to get the updated 'isPaid' status
      alert('Payment Successful!');
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p><strong>Name: </strong> {order.user.name}</p>
              <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
              <p><strong>Address: </strong>{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
              {order.isDelivered ? <Message variant='success'>Delivered on {order.deliveredAt}</Message> : <Message variant='danger'>Not Delivered</Message>}
            </ListGroup.Item>
            {/* ... Payment Method and Order Items ListGroups ... */}
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item><h2>Order Summary</h2></ListGroup.Item>
              <ListGroup.Item><Row><Col>Items</Col><Col>PKR {order.itemsPrice}</Col></Row></ListGroup.Item>
              <ListGroup.Item><Row><Col>Shipping</Col><Col>PKR {order.shippingPrice}</Col></Row></ListGroup.Item>
              <ListGroup.Item><Row><Col>Tax</Col><Col>PKR {order.taxPrice}</Col></Row></ListGroup.Item>
              <ListGroup.Item><Row><Col><strong>Total</strong></Col><Col><strong>PKR {order.totalPrice}</strong></Col></Row></ListGroup.Item>
              
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  <Button onClick={onPayWithJazzCash} type='button' className='w-100' variant='primary'>
                    <Image src={jazzcashLogo} style={{ height: '24px', marginRight: '10px' }} /> Pay with JazzCash
                  </Button>
                </ListGroup.Item>
              )}
              
              {/* --- AFTER PAYMENT --- */}
              {order.isPaid && (
                  <ListGroup.Item>
                      <Message variant='success'>Payment Confirmed!</Message>
                      <Card className="mt-3">
                          <Card.Header>Manual Transfer Details</Card.Header>
                          <Card.Body>
                              <Card.Text>
                                  Please complete the payment to the following JazzCash account:
                                  <br/><strong>Account Holder:</strong> Muhammad Amin Lakhani
                                  <br/><strong>Account Number:</strong> 0323-2297316
                              </Card.Text>
                              <Link to="/"><Button>Back to Home</Button></Link>
                          </Card.Body>
                      </Card>
                  </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderPage;