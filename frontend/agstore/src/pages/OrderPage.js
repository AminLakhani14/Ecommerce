import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button, Container } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetOrderDetailsQuery, usePayOrderMutation } from '../redux/slices/orderApiSlice';
import jazzcashLogo from '../assets/images/jazzcash.png';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const serverUrl = 'https://ecommerce-backend-production-f46e.up.railway.app';

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const onPayWithJazzCash = async () => {
    try {
      await payOrder(orderId).unwrap();
      refetch();
      alert('Payment Successful!');
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  return (
    <Container className="my-5">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <h1 className="mb-4">Order <span className="text-muted" style={{fontSize: '1.5rem'}}>#{order._id}</span></h1>
          <Row>
            <Col md={8}>
              <Card className="mb-4">
                <Card.Header as="h5">Shipping Details</Card.Header>
                <ListGroup variant='flush'>
                  {/* --- START: THIS IS THE FIX --- */}
                  {/* We are now reading all data from order.shippingAddress */}
                  <ListGroup.Item>
                    <strong>Name: </strong> {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Email: </strong> <a href={`mailto:${order.shippingAddress.email}`}>{order.shippingAddress.email}</a>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Phone: </strong> {order.shippingAddress.phone}
                  </ListGroup.Item>
                  {/* --- END: THIS IS THE FIX --- */}
                  <ListGroup.Item>
                    <strong>Address: </strong>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {order.isDelivered ? (
                      <Message variant='success'>Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</Message>
                    ) : (
                      <Message variant='warning'>Not Delivered</Message>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Card>

              {/* ... Rest of the component (Payment Details, Order Items) remains the same ... */}
              <Card className="mb-4">
                <Card.Header as="h5">Payment Details</Card.Header>
                <ListGroup variant='flush'>
                    <ListGroup.Item><strong>Method: </strong> {order.paymentMethod}</ListGroup.Item>
                    <ListGroup.Item>
                        {order.isPaid ? (
                        <Message variant='success'>Paid on {new Date(order.paidAt).toLocaleDateString()}</Message>
                        ) : (
                        <Message variant='warning'>Not Paid</Message>
                        )}
                    </ListGroup.Item>
                </ListGroup>
              </Card>

              <Card>
                <Card.Header as="h5">Order Items</Card.Header>
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row className="align-items-center">
                        <Col md={2}><Image src={`${serverUrl}${item.image}`} alt={item.name} fluid rounded /></Col>
                        <Col><Link to={`/product/${item.product}`}>{item.name}</Link><div>Size: {item.size}</div></Col>
                        <Col md={4} className="text-md-end">{item.qty} x PKR {item.price} = <strong>PKR {item.qty * item.price}</strong></Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>

            {/* --- RIGHT COLUMN: ORDER SUMMARY & PAYMENT --- */}
            <Col md={4}>
              <Card style={{ position: 'sticky', top: '20px' }}>
                <Card.Header as="h5">Order Summary</Card.Header>
                <ListGroup variant='flush'>
                  <ListGroup.Item><Row><Col>Items</Col><Col>PKR {order.itemsPrice}</Col></Row></ListGroup.Item>
                  <ListGroup.Item><Row><Col>Shipping</Col><Col>PKR {order.shippingPrice}</Col></Row></ListGroup.Item>
                  <ListGroup.Item><Row><Col><strong>Total</strong></Col><Col><strong>PKR {order.totalPrice}</strong></Col></Row></ListGroup.Item>
                  
                  {!order.isPaid && order.paymentMethod !== 'Cash on Delivery' && (
                    <ListGroup.Item>
                      {loadingPay && <Loader />}
                      <div className="d-grid">
                        <Button onClick={onPayWithJazzCash} type='button' variant='primary'>
                          <Image src={jazzcashLogo} style={{ height: '24px', marginRight: '10px' }} /> Pay with JazzCash
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
                  
                  {order.isPaid && (
                      <ListGroup.Item>
                          <Message variant='success'>Payment Confirmed!</Message>
                          {order.paymentMethod !== 'Cash on Delivery' && (
                            <Card className="mt-3 bg-light">
                                <Card.Body>
                                    <Card.Text className="small">
                                        Please complete the manual transfer to:
                                        <br/><strong>Account:</strong> Muhammad Amin Lakhani
                                        <br/><strong>Number:</strong> 0323-2297316
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                          )}
                           <div className="d-grid mt-3">
                             <Link to="/"><Button variant="outline-primary">Continue Shopping</Button></Link>
                           </div>
                      </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default OrderPage;