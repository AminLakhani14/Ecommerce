import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import styles from '../pages/styles/Hero.module.css';
// import heroImage from '../assets/images/hero-bg.jpg'; 

const Hero = () => {
  return (
    // Apply the background image via inline style
    <div
    //  className={styles.hero} style={{ backgroundImage: `url(${heroImage})` }}
    >
      <Container className={styles.heroContent}>
        <h1 className="display-3">New Season Arrivals</h1>
        <p className="lead">Check out all the new trends for this season</p>
        <LinkContainer to="/category/sale">
          <Button variant="dark" size="lg">Shop Now</Button>
        </LinkContainer>
      </Container>
    </div>
  );
};

export default Hero;