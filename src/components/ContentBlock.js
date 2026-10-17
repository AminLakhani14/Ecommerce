import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';

const ContentBlock = ({ imageSrc, imageAlt, title, children, imageLeft = true }) => {
  const imageCol = (
    <Col md={6} className="p-0">
      <Image src={imageSrc} alt={imageAlt} fluid />
    </Col>
  );

  const textCol = (
    <Col md={6} className="d-flex align-items-center p-5">
      <div>
        <h2 className="display-5 mb-3">{title}</h2>
        {children}
      </div>
    </Col>
  );

  return (
    <Row className="g-0 my-5">
      {imageLeft ? (
        <>
          {imageCol}
          {textCol}
        </>
      ) : (
        <>
          {textCol}
          {imageCol}
        </>
      )}
    </Row>
  );
};

export default ContentBlock;