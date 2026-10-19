import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import styles from '../pages/styles/PromoBanner.module.css';

const PromoBanner = ({ title, text, imageUrl, buttons }: { title: string; text: string; imageUrl: string; buttons?: Array<{ text: string; linkTo: string }> }) => (
  <div className='container'><section className={styles.banner}>
    <img src={imageUrl} alt='' loading='lazy' />
    <div className={styles.content}><p className='eyebrow'>SOMETHING WORTH DISCOVERING</p><h2>{title}</h2><p>{text}</p><div className={styles.actions}>{buttons?.map(button => <Link to={button.linkTo} key={button.linkTo}>{button.text}<FiArrowUpRight /></Link>)}</div></div>
    <span className={styles.note}>THE SALE EDIT</span>
  </section></div>
);
export default PromoBanner;
