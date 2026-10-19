import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import styles from './CategoryShowcase.module.css';

const ShowcaseCard = ({ imageSrc, title, linkTo }: { imageSrc: string; title: string; linkTo: string }) => (
  <Link to={linkTo} className={styles.showcaseCard} aria-label={title}>
    <img src={imageSrc} alt='' className={styles.showcaseImage} loading='lazy' />
    <div className={styles.buttonWrapper}><span><small>THE COLLECTION</small>{title.replace(/^Shop /, '')}</span><span className={styles.showcaseButton}><FiArrowUpRight /></span></div>
  </Link>
);
export default ShowcaseCard;
