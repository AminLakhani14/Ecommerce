import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col, Card } from 'react-bootstrap';
import Message from '../components/Message';

const ThankYouPage = () => {
  const { id: orderId } = useParams();

  return (
    <Row className="justify-content-center my-5">
      <Col md={8}>
        <Card className="text-center p-4 shadow-sm">
          <Card.Body>
            <h1 className="text-success">✔</h1>
            <h2 className="mb-3">Thank You For Your Order!</h2>
            <Message variant='success'>
              Your order number is <strong>{orderId}</strong>. A confirmation email has been sent.
            </Message>
            <p className="mt-3">We have received your order and will begin processing it shortly.</p>
            <Link to='/'>
              <Button variant='dark' className="mt-2">Continue Shopping</Button>
            </Link>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
export default ThankYouPage;