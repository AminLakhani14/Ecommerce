import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard'; // We will use our existing ProductCard
import styles from './TabbedProductShowcase.module.css';
import { useGetCategoriesQuery } from '../redux/slices/categoriesApiSlice';

const TabbedProductShowcase = ({ menProducts, womenProducts }: { menProducts?: import('../types').Product[]; womenProducts?: import('../types').Product[] }) => {
  const [activeTab, setActiveTab] = useState('Women'); // Default to 'Women'
  const { data: categories = [] } = useGetCategoriesQuery();
  const tabs = ['Women', 'Men'].filter(tab => categories.some(name => name.toLowerCase() === tab.toLowerCase()));
  const displayedTab = tabs.includes(activeTab) ? activeTab : tabs[0];
  const productsToShow = displayedTab === 'Women' ? womenProducts : menProducts;
  if (!tabs.length) return null;

  return (
    <div className="my-5">
      <div className="align-items-center mb-4">
        <h2 className="me-4 mb-4">HOW DO YOU SHOP?</h2>
        <div className={styles.tabWrapper}>
          {tabs.map(tab => <button key={tab}
            className={`${styles.tabButton} ${displayedTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </div>
      </div>

      <Row className="product-grid">
        {productsToShow && productsToShow.length > 0 ? (
          productsToShow.slice(0, 4).map((product) => ( // Show up to 4 products
            <Col key={product._id} xs={12} sm={6} md={4} lg={3} >
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
