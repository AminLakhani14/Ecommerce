import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-dark text-white mt-5 p-4">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5>AG-Store</h5>
            <p>Your one-stop shop for the latest fashion trends. Quality apparel for men, women, and children.</p>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/about" className="text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="text-white">FAQ</Link></li>
            </ul>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Contact Info</h5>
            <p><i className="fas fa-envelope me-2"></i>Email: support@agstore.com</p>
            <p><i className="fas fa-phone me-2"></i>Phone: +92 300 1234567</p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center pt-3 border-top border-secondary">
            <p>AG-Store © {currentYear}. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;