import React from 'react';
import styles from './QuantityCounter.module.css'; // <-- Import the new CSS module

const QuantityCounter = ({ value, setValue, max }) => {
  const increment = () => {
    if (value < max) {
      setValue(value + 1);
    }
  };

  const decrement = () => {
    if (value > 1) {
      setValue(value - 1);
    }
  };

  return (
    <div className={styles.counterWrapper}>
      <button 
        type="button"
        className={styles.qtyButton}
        onClick={decrement} 
        disabled={value <= 1}
        style={{ borderRadius: '0.375rem 0 0 0.375rem' }} // Left rounded corners
      >
        -
      </button>
      <input 
        type="text" 
        readOnly 
        value={value} 
        className={`form-control ${styles.qtyInput}`}
      />
      <button 
        type="button"
        className={styles.qtyButton}
        onClick={increment} 
        disabled={value >= max}
        style={{ borderRadius: '0 0.375rem 0.375rem 0' }} // Right rounded corners
      >
        +
      </button>
    </div>
  );
};

export default QuantityCounter;