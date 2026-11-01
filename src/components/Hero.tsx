import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import styles from '../pages/styles/Hero.module.css';

const Hero = () => <section className={styles.videoHero} aria-label='The everyday edit'>
  <h1 className='visually-hidden'>SBR Fashion – Clothing, Accessories and Backpacks</h1>
  <video
    className={styles.promoVideo}
    autoPlay
    loop
    muted
    playsInline
    preload='auto'
    poster='/videos/ecommerce-promo-poster.jpg?v=2'
    aria-label='Discover bags, accessories, T-shirts and jeans, with a demonstration of adding a bag to the cart and confirming an order.'
  >
    <source src='/videos/ecommerce-promo.mp4?v=2' type='video/mp4' />
    Discover our everyday edit of bags, accessories and clothing.
  </video>
  <div className={`${styles.videoActions} container`}>
    <Link to='/sale' className={styles.primary}>Shop the edit <FiArrowUpRight /></Link>
    <Link to='/about' className={styles.secondary}>Our story <FiArrowUpRight /></Link>
  </div>
</section>;
export default Hero;
