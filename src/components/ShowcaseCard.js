import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CategoryShowcase.module.css'; // We will create this file next

const ShowcaseCard = ({ imageSrc, title, linkTo }) => {
  return (
    <Link to={linkTo} className={styles.showcaseCard}>
      <img src={imageSrc} alt={title} className={styles.showcaseImage} />
      <div className={styles.buttonWrapper}>
        <button className={styles.showcaseButton}>
          {title}
        </button>
      </div>
    </Link>
  );
};

export default ShowcaseCard;