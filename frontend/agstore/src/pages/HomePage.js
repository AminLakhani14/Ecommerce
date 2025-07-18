import React from 'react';
import { useGetHomepageProductsQuery } from '../redux/slices/productsApiSlice';
import { Row, Col, Container } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Hero from '../components/Hero';
import PromoBanner from '../components/PromoBanner'; // <-- Import new component

const ProductSection = ({ title, products, error }) => (
  // Added my-5 for vertical spacing
  <div className="my-5"> 
    <h2 className="text-center mb-4">{title}</h2>
    {error ? (
      <Message variant='danger'>Could not load products.</Message>
    ) : (
      <Row>
        {products && products.length > 0 ? (
          products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))
        ) : (
          <p className="text-center">No products found in this category yet.</p>
        )}
      </Row>
    )}
  </div>
);


const HomePage = () => {
  const { data, isLoading, error } = useGetHomepageProductsQuery();
  
  console.log(data)
  return (
    <>
      <Hero />
      <Container>
            <ProductSection title="Latest in Men's Fashion" products={data?.men} />

            <PromoBanner
              title="Sharp Styles for Men"
              text="Upgrade your wardrobe with our premium menswear."
              imageUrl="https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=2070"
              buttonText="Shop Men"
              linkTo="/category/Men"
            />

            {/* --- START: NEW PROMO BANNERS --- */}
            {/* <ProductSection title="Top Picks for Women" products={data.women} /> */}
            <PromoBanner
              title="For The Modern Woman"
              text="Discover elegance and style in our new women's collection."
              imageUrl="https://www.beverlyhillsmagazine.com/wp-content/uploads/Beverly-Hills-Magazine-Simple-Style-Tips-for-Modern-Working-Women-min.jpg"
              buttonText="Shop Women"
              linkTo="/category/Women"
            />
            {/* --- END: NEW PROMO BANNERS --- */}

            
            {/* <ProductSection title="New for Children" products={data.children} /> */}
            
            <PromoBanner
              title="Mid-Season Sale"
              text="Get up to 50% off on your favorite styles. Don't miss out!"
              imageUrl="https://ual-media-res.cloudinary.com/image/fetch/https://www.arts.ac.uk/__data/assets/image/0018/31914/BA-Fashion-Menswear.jpg"
              buttonText="Shop Sale"
              linkTo="/category/Sale"
            />
            
            {/* <ProductSection title="Hot Sale Items" products={data.sale} /> */}
      </Container>
    </>
  );
};

export default HomePage;