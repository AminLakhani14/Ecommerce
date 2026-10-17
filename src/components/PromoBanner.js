import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import styles from '../pages/styles/PromoBanner.module.css';

// The component now accepts an array of buttons
const PromoBanner = ({ title, text, imageUrl, buttons }) => {
  return (
    <Card className="text-white my-4 shadow-lg border-0 rounded-0">
      <Card.Img src={imageUrl} alt={title} className={styles.bannerImage} />
      <Card.ImgOverlay className={styles.bannerOverlay}>
        <div className={styles.bannerContentWrapper}>
            <div className={styles.bannerContent}>
              <Card.Title as="h2">{title}</Card.Title>
              <Card.Text>{text}</Card.Text>
              
              {buttons && buttons.length > 0 && (
                <div className={styles.buttonGroup}>
                  {buttons.map((button, index) => (
                    <LinkContainer to={button.linkTo} key={index}>
                      <Button variant="light">{button.text}</Button>
                    </LinkContainer>
                  ))}
                </div>
              )}
            </div>
        </div>
      </Card.ImgOverlay>
    </Card>
  );
};

export default PromoBanner;