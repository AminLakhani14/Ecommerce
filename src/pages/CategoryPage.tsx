import { getErrorMessage } from '../utils/getErrorMessage';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useGetProductsByCategoryQuery } from '../redux/slices/productsApiSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { collections } from '../data/collections';

const CategoryPage = () => {
  const { categoryName = '' } = useParams();
  const { data: products, isLoading, error } = useGetProductsByCategoryQuery(categoryName);

  // Capitalize the first letter for the title
  const collection = collections[categoryName.toLowerCase() as keyof typeof collections];
  const pageTitle = collection?.title || categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  const groupProductsBySubCategory = (products: import('../types').Product[]) => {
    return products.reduce<Record<string, import('../types').Product[]>>((acc, product) => {
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
      return <Message variant='danger'>{getErrorMessage(error)}</Message>;
    }

    if (!products || products.length === 0) {
      return <Message>No products found in this category yet.</Message>;
    }

    if (collection) {
      return <>
        <p className='text-muted mb-4'>{products.length} products</p>
        <Row className='g-4'>
          {products.map(product => <Col key={product._id} xs={12} sm={6} lg={4} xl={3}>
            <ProductCard product={product} />
          </Col>)}
        </Row>
      </>;
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
      <div className='py-4 mb-4 border-bottom'>
        {collection && <p className='text-uppercase text-muted small mb-2'>{collection.subtitle}</p>}
        <h1 className="mb-3">{pageTitle}</h1>
        {collection && <p className='text-muted mb-0' style={{ maxWidth: '650px' }}>{collection.description}</p>}
      </div>
      {renderContent()}
    </Container>
  );
};

export default CategoryPage;
