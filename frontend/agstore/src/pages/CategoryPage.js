import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useGetProductsByCategoryQuery } from '../redux/slices/productsApiSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { data: products, isLoading, error } = useGetProductsByCategoryQuery(categoryName);

  // Capitalize the first letter for the title
  const pageTitle = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  const groupProductsBySubCategory = (products) => {
    return products.reduce((acc, product) => {
      const key = product.subCategory || 'Other'; // Group products without a sub-category under 'Other'
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(product);
      return acc;
    }, {});
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    
    if (error) {
      return <Message variant='danger'>{error?.data?.message || error.error}</Message>;
    }

    if (!products || products.length === 0) {
      return <Message>No products found in this category yet.</Message>;
    }

    // If we have data, group it and then render it
    const groupedProducts = groupProductsBySubCategory(products);
    return Object.keys(groupedProducts).map(subCategory => (
      <div key={subCategory} className="mb-5">
        <h2 className="text-muted">{subCategory}</h2>
        <hr />
        <Row>
          {groupedProducts[subCategory].map(product => (
            <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      </div>
    ));
  };

 return (
    <Container className="my-5">
      <h1 className="mb-4">{pageTitle} Collection</h1>
      {renderContent()}
    </Container>
  );
};

export default CategoryPage;