import { Container, Row, Col } from 'react-bootstrap';
import ShowcaseCard from './ShowcaseCard';
import { collections } from '../data/collections';

export default function CategoryShowcase() {
  return <Container className='my-5 py-3'>
    <h2 className='mb-4'>Explore the collections</h2>
    <Row className='g-4'>
      {Object.entries(collections).map(([slug, collection]) => <Col key={slug} md={4}>
        <ShowcaseCard imageSrc={collection.image} title={`Shop ${collection.title}`} linkTo={`/category/${slug}`} />
      </Col>)}
    </Row>
  </Container>;
}
