import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import styles from '../pages/styles/Hero.module.css';

const Hero = () => {
  return (
    // The outer div IS the full-width background
    <div className={styles.hero} 
    style={{ backgroundImage: `url(${'https://assets.vogue.com/photos/6324cbb0563d9de75791b508/master/w_1920,c_limit/___collage_story.jpg'})` }}
    >
      {/* --- START: THIS IS THE FIX --- */}
      {/* We use a standard div with a custom class for the centered content, INSTEAD of a Bootstrap <Container> */}
      <div className={styles.heroContent}>
        <h1 className="display-3 text-white">New Season Arrivals</h1>
        <p className="lead text-white">Check out all the new trends for this season</p>
        <LinkContainer to="/sale">
          <Button variant="dark" size="lg">Shop Now</Button>
        </LinkContainer>
      </div>
      {/* --- END: THIS IS THE FIX --- */}
    </div>
  );
};

export default Hero;