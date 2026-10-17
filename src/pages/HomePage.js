import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useGetHomepageProductsQuery } from '../redux/slices/productsApiSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Hero from '../components/Hero';
import PromoBanner from '../components/PromoBanner';
import CategoryShowcase from '../components/CategoryShowcase';
import TabbedProductShowcase from '../components/TabbedProductShowcase';

const ProductSection = ({ title, products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="my-5">
      <h2 className="text-center mb-4">{title}</h2>
      <Row>
        {products.map((product) => (
          <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex">
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
      return <Container><Message variant='danger'>{error?.data?.message || 'An error occurred while fetching products.'}</Message></Container>;
    }
    
    if (data) {
      return (
        <>
          <Container>
            <TabbedProductShowcase 
              menProducts={data.men} 
              womenProducts={data.women} 
            />
          </Container>

          <CategoryShowcase />

          <PromoBanner
            title="Mid-Season Sale"
            text="Get up to 50% off on your favorite styles. Don't miss out!"
             imageUrl="https://9f8e62d4.delivery.rocketcdn.me/wp-content/uploads/2023/08/Promote-Positive-Communication.jpg"
            buttons={[
              { text: 'Shop Sale', linkTo: '/sale' },
              // { text: 'Shop Women', linkTo: '/sale?category=Women' }
            ]}
          />
          <Container>
            <ProductSection title="New for Children" products={data.children} />
            <ProductSection title="Essential Accessories" products={data.accessories} />
            <ProductSection title="Hot Sale Items" products={data.sale} />
          </Container>
        </>
      );
    }
    return null;
  };

  return (
    <>
      <Hero />
      {renderContent()}
    </>
  );
};

export default HomePage;