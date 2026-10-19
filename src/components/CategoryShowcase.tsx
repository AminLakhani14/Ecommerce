import { Container, Row, Col } from 'react-bootstrap';
import ShowcaseCard from './ShowcaseCard';
import { collections } from '../data/collections';
import { useGetCategoriesQuery } from '../redux/slices/categoriesApiSlice';

export default function CategoryShowcase() {
  const { data: categories = [] } = useGetCategoriesQuery();
  const visibleCollections = Object.entries(collections).filter(([slug]) => categories.some(name => name.toLowerCase() === slug));
  if (!visibleCollections.length) return null;
  return <Container className='store-section' id='collections'>
    <div className='section-heading'><div><p className='eyebrow'>A LITTLE INSPIRATION</p><h2>Explore the collections</h2></div><p className='section-note'>Find your next everyday favorite.</p></div>
    <Row className='g-4'>
      {visibleCollections.map(([slug, collection]) => <Col key={slug} md={4}>
        <ShowcaseCard imageSrc={collection.image} title={`Shop ${collection.title}`} linkTo={`/category/${slug}`} />
      </Col>)}
    </Row>
  </Container>;
}
