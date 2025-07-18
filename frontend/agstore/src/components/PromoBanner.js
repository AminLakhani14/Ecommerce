import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import styles from '../pages/styles/PromoBanner.module.css';

const PromoBanner = ({ title, text, imageUrl, buttonText, linkTo }) => {
  return (
    <Card className="text-white my-4 shadow-lg border-0">
      <Card.Img src={imageUrl} alt={title} className={styles.bannerImage} />
      <Card.ImgOverlay className={styles.bannerOverlay}>
        <div className={styles.bannerContent}>
          <Card.Title as="h2">{title}</Card.Title>
          <Card.Text>{text}</Card.Text>
          <LinkContainer to={linkTo}>
            <Button variant="light">{buttonText}</Button>
          </LinkContainer>
        </div>
      </Card.ImgOverlay>
    </Card>
  );
};

export default PromoBanner;