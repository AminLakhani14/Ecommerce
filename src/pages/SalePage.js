import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useGetSaleProductsQuery } from '../redux/slices/productsApiSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

const SalePage = () => {
  const { data: saleProducts, isLoading, error } = useGetSaleProductsQuery();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (saleProducts) {
        setFilteredProducts(saleProducts);
    }
  }, [saleProducts]);

  return (
    <Container className="my-5">
      <h1 className="mb-4">On Sale</h1>
      {isLoading ? <Loader /> : error ? <Message variant='danger'>{error.data.message}</Message> : (
        <Row>
          {filteredProducts.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};
export default SalePage;