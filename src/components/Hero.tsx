import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import styles from '../pages/styles/Hero.module.css';

const Hero = () => <section className={styles.hero} aria-label='The everyday edit'>
  <div className={`${styles.heroContent} container`}>
    <p className={styles.eyebrow}><span /> THE EVERYDAY EDIT</p>
    <h1>Good style.<br /><em>Great finds.</em></h1>
    <p className={styles.description}>A fresh perspective on the everyday.<br />Discover pieces that feel like you.</p>
    <div className={styles.actions}><Link to='/sale' className={styles.primary}>Shop the edit <FiArrowUpRight /></Link><Link to='/about' className={styles.secondary}>Our story <FiArrowUpRight /></Link></div>
    <div className={styles.footnote}><span>New Season Arrivals</span><span>YOUR EVERYDAY, ELEVATED.</span></div>
  </div>
</section>;
export default Hero;
