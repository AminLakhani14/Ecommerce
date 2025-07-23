import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useGetProductsByFilterQuery } from '../redux/slices/productsApiSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

const FilteredProductPage = () => {
  const { category, subCategory } = useParams();
  const decodedCategory = decodeURIComponent(category);
  const decodedSubCategory = decodeURIComponent(subCategory);

  const { data: products, isLoading, error } = useGetProductsByFilterQuery({ 
    category: decodedCategory, 
    subCategory: decodedSubCategory 
  });

  return (
    <Container className="my-5">
      <h1 className="mb-1">{decodedSubCategory}</h1>
      <p className="text-muted mb-4">In {decodedCategory}</p>
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <Row>
          {!products || products.length === 0 ? (
            <Message>No products found for this filter.</Message>
          ) : (
            products.map((product) => (
              <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  );
};

export default FilteredProductPage;