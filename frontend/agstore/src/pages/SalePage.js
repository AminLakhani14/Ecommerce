import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { useGetSaleProductsQuery } from '../redux/slices/productsApiSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

const SalePage = () => {
  const { data: saleProducts, isLoading, error } = useGetSaleProductsQuery();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (saleProducts) {
      if (activeFilter === 'All') {
        setFilteredProducts(saleProducts);
      } else {
        setFilteredProducts(saleProducts.filter(p => p.category === activeFilter));
      }
    }
  }, [saleProducts, activeFilter]);

  const handleFilter = (category) => {
    setActiveFilter(category);
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">On Sale</h1>
      <ButtonGroup className="mb-4">
        <Button variant={activeFilter === 'All' ? 'dark' : 'outline-dark'} onClick={() => handleFilter('All')}>All</Button>
        <Button variant={activeFilter === 'Men' ? 'dark' : 'outline-dark'} onClick={() => handleFilter('Men')}>Men</Button>
        <Button variant={activeFilter === 'Women' ? 'dark' : 'outline-dark'} onClick={() => handleFilter('Women')}>Women</Button>
        <Button variant={activeFilter === 'Children' ? 'dark' : 'outline-dark'} onClick={() => handleFilter('Children')}>Children</Button>
      </ButtonGroup>
      
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