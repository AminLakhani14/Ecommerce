import { Container, Row, Col, Image } from 'react-bootstrap';
// import aboutImage from '../assets/images/about-us.jpg'; // Add a relevant image here

const AboutPage = () => {
  return (
    <Container className="my-5">
      <Row className="align-items-center">
        <Col md={6}>
          <h1 className="display-4">About AG-Store</h1>
          <p className="lead">
            Founded in 2024, AG-Store was born from a passion for fashion and a desire to bring high-quality, trendy apparel to everyone. We believe that style is a way to express who you are without having to speak.
          </p>
          <p>
            Our mission is to provide an unparalleled shopping experience by offering a curated selection of the latest trends for men, women, and children. From casual wear to statement pieces, every item in our collection is chosen with care to ensure it meets our high standards of quality and style.
          </p>
          <p>
            We are committed to sustainability and ethical sourcing, working closely with our partners to create fashion that you can feel good about. Thank you for being a part of our journey.
          </p>
        </Col>
        <Col md={6}>
          {/* <Image src={aboutImage} fluid rounded className="shadow" /> */}
        </Col>
      </Row>
    </Container>
  );
};
export default AboutPage;