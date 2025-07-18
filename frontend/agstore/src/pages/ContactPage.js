import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <Container className="my-5">
      <h1 className="text-center mb-5">Get In Touch</h1>
      <Row>
        <Col md={6} className="mx-auto">
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <p className="lead text-center">We'd love to hear from you! Whether you have a question about our products, an order, or just want to say hello, feel free to reach out.</p>
              <hr/>
              <div className="d-flex align-items-center my-3">
                <FaMapMarkerAlt size={24} className="me-3 text-primary" />
                <span>123 Fashion Ave, Karachi, Pakistan</span>
              </div>
              <div className="d-flex align-items-center my-3">
                <FaPhone size={24} className="me-3 text-primary" />
                <span>+92 300 1234567</span>
              </div>
              <div className="d-flex align-items-center my-3">
                <FaEnvelope size={24} className="me-3 text-primary" />
                <span>support@agstore.com</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default ContactPage;