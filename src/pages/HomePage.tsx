import React from 'react';
import { getErrorMessage } from '../utils/getErrorMessage';
import { Container, Row, Col } from 'react-bootstrap';
import { useGetHomepageProductsQuery } from '../redux/slices/productsApiSlice';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Hero from '../components/Hero';
import PromoBanner from '../components/PromoBanner';
import CategoryShowcase from '../components/CategoryShowcase';

const ProductSection = ({ title, products, category }: { title: string; products?: import('../types').ProductSummary[]; category?: string }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="store-product-section">
      <div className='section-heading'>
        <h2 className='mb-0'>{title}</h2>
        {category && <Link className='section-view-all' to={`/category/${category}`}>View all</Link>}
      </div>
      <Row className="product-grid">
        {products.map((product) => (
          <Col key={product._id} xs={6} md={4} lg={3} className="d-flex">
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

const HomePage = () => {
  const { data, isLoading, error } = useGetHomepageProductsQuery();

  const renderContent = () => {
    if (isLoading) {
      return <Container className="text-center py-5"><Loader /></Container>;
    }

    if (error) {
      return <Container><Message variant='danger'>{getErrorMessage(error)}</Message></Container>;
    }
    
    if (data) {
      return (
          <Container>
            <ProductSection title="New for Children" products={data.children} />
            <ProductSection title="Essential Accessories" category='accessories' products={data.accessories} />
            <ProductSection title="Backpacks for Every Day" category='backpacks' products={data.backpacks} />
            <ProductSection title="Find Your Everyday Style" category='clothing' products={data.clothing} />
            <ProductSection title="Hot Sale Items" products={data.sale} />
          </Container>
      );
    }
    return null;
  };

  return (
    <>
      <Hero />
      <CategoryShowcase />
      <PromoBanner
        title="Mid-Season Sale"
        text="Discover selected styles in our sale edit. Find something you love."
        imageUrl="https://9f8e62d4.delivery.rocketcdn.me/wp-content/uploads/2023/08/Promote-Positive-Communication.jpg"
        buttons={[{ text: 'Shop Sale', linkTo: '/sale' }]}
      />
      {renderContent()}
    </>
  );
};

export default HomePage;
