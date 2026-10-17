import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard'; // We will use our existing ProductCard
import styles from './TabbedProductShowcase.module.css';

const TabbedProductShowcase = ({ menProducts, womenProducts }) => {
  const [activeTab, setActiveTab] = useState('Women'); // Default to 'Women'

  const productsToShow = activeTab === 'Women' ? womenProducts : menProducts;

  return (
    <div className="my-5">
      <div className="align-items-center mb-4">
        <h2 className="me-4 mb-4">HOW DO YOU SHOP?</h2>
        <div className={styles.tabWrapper}>
          <button
            className={`${styles.tabButton} ${activeTab === 'Women' ? styles.active : ''}`}
            onClick={() => setActiveTab('Women')}
          >
            Women
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'Men' ? styles.active : ''}`}
            onClick={() => setActiveTab('Men')}
          >
            Men
          </button>
        </div>
      </div>

      <Row>
        {productsToShow && productsToShow.length > 0 ? (
          productsToShow.slice(0, 4).map((product) => ( // Show up to 4 products
            <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))
        ) : (
          <p>No products to display.</p>
        )}
      </Row>
    </div>
  );
};

export default TabbedProductShowcase;