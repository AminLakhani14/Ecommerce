import { Link } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import styles from '../pages/styles/Commerce.module.css';
const steps = [{ label: 'Shopping bag', to: '/cart' }, { label: 'Delivery details', to: '/shipping' }, { label: 'Confirmation' }];
export default function CheckoutProgress({ current }: { current: number }) {
  return <ol className={styles.progress} aria-label='Checkout progress'>
    {steps.map((step, index) => {
      const number = index + 1, done = number < current, active = number === current;
      const marker = <><span className={styles.progressDot}>{done ? <FiCheck aria-hidden='true' /> : number}</span><span className={styles.progressLabel}>{step.label}</span></>;
      return <li key={step.label} className={done ? styles.progressDone : active ? styles.progressActive : undefined} aria-current={active ? 'step' : undefined}>
        {done && step.to ? <Link to={step.to}>{marker}</Link> : <span>{marker}</span>}
      </li>;
    })}
  </ol>;
}
