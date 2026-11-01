import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="store-footer">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5 className="footer-brand">Sbrfashion</h5>
            <p>Your one-stop shop for the latest fashion trends. Quality apparel for men, women, and children.</p>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/about" >About Us</Link></li>
              <li><Link to="/contact" >Contact Us</Link></li>
              <li><Link to="/faq" >FAQ</Link></li>
            </ul>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Contact Info</h5>
            <p>LA Downtown</p>
            <p><i className="fas fa-envelope me-2"></i><a href='mailto:fashionsbr3@gmail.com'>fashionsbr3@gmail.com</a></p>
            <p><i className="fas fa-phone me-2"></i><a href='tel:+13102272015'>+1 (310) 227-2015</a></p>
          </Col>
        </Row>
        <Row>
          <Col className="footer-bottom">
            <p>Sbrfashion © {currentYear}. All Rights Reserved.</p><span>USD &middot; United States Dollar</span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
