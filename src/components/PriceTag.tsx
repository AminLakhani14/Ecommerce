import { formatUSD } from '../utils/currency';
import { getPricing } from '../utils/pricing';
import styles from './PriceTag.module.css';

type Props = { product: Parameters<typeof getPricing>[0]; size?: 'sm' | 'lg'; showBadge?: boolean; className?: string };

/** Sale price with the struck-through regular price beside it. */
const PriceTag = ({ product, size = 'sm', showBadge = true, className = '' }: Props) => {
  const { original, current, onSale, percentOff } = getPricing(product);
  return (
    <span className={`${styles.priceTag} ${styles[size]} ${className}`}>
      <span className={onSale ? styles.sale : styles.current}>{formatUSD(current)}</span>
      {onSale && (
        <>
          <s className={styles.original} aria-label={`Was ${formatUSD(original)}`}>{formatUSD(original)}</s>
          {showBadge && <span className={styles.badge}>-{percentOff}%</span>}
        </>
      )}
    </span>
  );
};

export default PriceTag;
