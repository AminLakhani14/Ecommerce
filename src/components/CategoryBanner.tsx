import { Link } from 'react-router-dom';
import styles from './CategoryBanner.module.css';

type Props = { eyebrow: string; title: string; text: string; imageUrl: string; buttons: Array<{ text: string; linkTo: string }> };

/** Edge-to-edge image that introduces a homepage product section. */
const CategoryBanner = ({ eyebrow, title, text, imageUrl, buttons }: Props) => (
  <div className={styles.banner}>
    <img src={imageUrl} alt='' loading='lazy' />
    <div className={`container ${styles.content}`}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2>{title}</h2>
      <p className={styles.text}>{text}</p>
      <div className={styles.actions}>
        {buttons.map(button => <Link key={button.linkTo} to={button.linkTo}>{button.text}</Link>)}
      </div>
    </div>
  </div>
);

export default CategoryBanner;
