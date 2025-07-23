import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ShowcaseCard from './ShowcaseCard';

const CategoryShowcase = () => {
  return (
    <Container className="my-5">
      <Row>
        <Col md={4} className="mb-4">
          <ShowcaseCard
            imageSrc="https://images.stockcake.com/public/6/8/5/685d9f13-d82d-428c-8c13-f85a4dd252dd_large/fit-athletic-woman-stockcake.jpg"
            title="Shop Women"
            linkTo="/category/women"
          />
        </Col>
        <Col md={4} className="mb-5">
          <ShowcaseCard
            imageSrc="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1965"
            title="Shop Men"
            linkTo="/category/men"
          />
        </Col>
        <Col md={4} className="mb-6">
          <ShowcaseCard
            imageSrc="https://katespade.com.au/dw/image/v2/BDFS_PRD/on/demandware.static/-/Sites-katespade-master-catalog/default/dwf343031b/images/KL194/K_KL194960_2.jpg?sw=600&sh=800"
            title="Shop Accessories"
            linkTo="/category/accessories"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryShowcase;