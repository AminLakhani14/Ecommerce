import React from 'react';
import { getErrorMessage } from '../utils/getErrorMessage';
import { Container, Row, Col } from 'react-bootstrap';
import { useGetHomepageProductsQuery } from '../redux/slices/productsApiSlice';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Hero from '../components/Hero';
import CategoryShowcase from '../components/CategoryShowcase';
import CategoryBanner from '../components/CategoryBanner';

type Section = { key: string; eyebrow: string; title: string; text: string; image: string; link: string; cta: string; category?: string };

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2400&q=80`;

// Each homepage section opens with a full-width image, followed by its products.
const sections: Section[] = [
  { key: 'children', eyebrow: 'New season', title: 'For Little Ones', text: 'Playful, comfortable pieces made for running, climbing and everything in between.', image: unsplash('1471286174890-9c112ffca5b4'), link: '/category/children', cta: 'Shop Children' },
  { key: 'accessories', eyebrow: 'Finishing touches', title: 'Essential Accessories', text: 'Sunglasses, watches and the small details that complete every look.', image: unsplash('1511499767150-a48a237f0083'), link: '/category/accessories', cta: 'Shop Accessories', category: 'accessories' },
  { key: 'backpacks', eyebrow: 'Carry it all', title: 'Backpacks for Every Day', text: 'Built for commutes, weekends away and everything you take with you.', image: unsplash('1622560480605-d83c853bc5c3'), link: '/category/backpacks', cta: 'Shop Backpacks', category: 'backpacks' },
  { key: 'clothing', eyebrow: 'The wardrobe edit', title: 'Find Your Everyday Style', text: 'Easy staples and standout pieces to wear on repeat.', image: unsplash('1445205170230-053b83016050'), link: '/category/clothing', cta: 'Shop Clothing', category: 'clothing' },
  { key: 'sale', eyebrow: 'Limited time', title: 'Hot Sale Items', text: 'Favourites at reduced prices, while stocks last.', image: unsplash('1607082348824-0a96f2a4b9da'), link: '/sale', cta: 'Shop Sale' },
];

const ProductSection = ({ title, products, category }: { title: string; products?: import('../types').ProductSummary[]; category?: string }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="store-product-section">
      <div className='section-heading'>
        <p className='eyebrow mb-0'>{title}</p>
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
          <>
            {sections.filter((section) => data[section.key]?.length).map((section) => (
              <section key={section.key}>
                <CategoryBanner
                  eyebrow={section.eyebrow}
                  title={section.title}
                  text={section.text}
                  imageUrl={section.image}
                  buttons={[{ text: section.cta, linkTo: section.link }]}
                />
                <Container>
                  <ProductSection title={`Shop ${section.title}`} category={section.category} products={data[section.key]} />
                </Container>
              </section>
            ))}
          </>
      );
    }
    return null;
  };

  return (
    <>
      <Hero />
      <CategoryShowcase />
      {renderContent()}
    </>
  );
};

export default HomePage;
