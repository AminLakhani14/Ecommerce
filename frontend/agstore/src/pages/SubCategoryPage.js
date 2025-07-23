import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useGetProductsBySubCategoryQuery } from '../redux/slices/productsApiSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

const SubCategoryPage = () => {
  const { subCategoryName } = useParams();
  const decodedSubCategoryName = decodeURIComponent(subCategoryName);

  const { data: products, isLoading, error } = useGetProductsBySubCategoryQuery(decodedSubCategoryName);

  return (
    <Container className="my-5">
      <h1 className="mb-4">{decodedSubCategoryName}</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <Row>
          {!products || products.length === 0 ? (
            <Message>No products found in this sub-category yet.</Message>
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

export default SubCategoryPage;