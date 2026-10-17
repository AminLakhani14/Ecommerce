import React from 'react';
import { getErrorMessage } from '../utils/getErrorMessage';
import { Container, Row, Col } from 'react-bootstrap';
import { useGetHomepageProductsQuery, useGetProductsQuery } from '../redux/slices/productsApiSlice';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Hero from '../components/Hero';
import PromoBanner from '../components/PromoBanner';
import CategoryShowcase from '../components/CategoryShowcase';
import TabbedProductShowcase from '../components/TabbedProductShowcase';

const ProductSection = ({ title, products, category }: { title: string; products?: import('../types').Product[]; category?: string }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="my-5">
      <div className='d-flex justify-content-between align-items-center gap-3 mb-4'>
        <h2 className='mb-0'>{title}</h2>
        {category && <Link className='text-dark text-nowrap' to={`/category/${category}`}>View all</Link>}
      </div>
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
  const { data: catalog = [] } = useGetProductsQuery();

  const renderContent = () => {
    if (isLoading) {
      return <Container className="text-center py-5"><Loader /></Container>;
    }

    if (error) {
      return <Container><Message variant='danger'>{getErrorMessage(error)}</Message></Container>;
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
            <ProductSection title="Essential Accessories" category='accessories' products={catalog.filter(p => p.category === 'Accessories').slice(0, 4)} />
            <ProductSection title="Backpacks for Every Day" category='backpacks' products={catalog.filter(p => p.category === 'Backpacks').slice(0, 4)} />
            <ProductSection title="Find Your Everyday Style" category='clothing' products={catalog.filter(p => p.category === 'Clothing').slice(0, 4)} />
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
