import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './styles/AboutPage.module.css';

export default function AboutPage() {
  return <>
    <section className={styles.hero}>
      <Container>
        <p className={styles.eyebrow}>A little about AG-Store</p>
        <h1>Everyday style.<br />Your own way.</h1>
        <p className={styles.intro}>Clothing you reach for. Accessories that feel like you. Backpacks that go wherever life takes you.</p>
      </Container>
    </section>
    <Container className='py-5'>
      <Row className='align-items-center g-5 py-lg-4'>
        <Col md={6}>
          <img className={styles.storyImage} src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1100&q=85' alt='Thoughtfully arranged clothing in a bright fashion store' />
        </Col>
        <Col md={6}>
          <p className={styles.eyebrow}>Our story</p>
          <h2 className='mb-4'>Good style starts<br />with feeling yourself.</h2>
          <p>AG-Store brings clothing, accessories, and backpacks together in one place, making it easier to build a wardrobe around the way you live.</p>
          <p className='text-muted'>We believe the best pieces are the ones you make your own. Explore everyday staples, discover a new favorite, or find that finishing touch for your next outfit.</p>
          <Link to='/category/clothing' className='btn btn-dark mt-2 px-4 py-2'>Explore clothing</Link>
        </Col>
      </Row>
      <Row className='g-4 py-5 mt-2'>
        {[
          ['01', 'Style for everyday', 'Pieces for workdays, weekends, and everything in between.'],
          ['02', 'Room to be you', 'A mix of looks and finishing touches to express your own point of view.'],
          ['03', 'A simpler way to shop', 'Clear product details, easy browsing, and your favorites all in one place.'],
        ].map(([number, title, text]) => <Col md={4} key={number}>
          <div className={styles.value}><span>{number}</span><h3>{title}</h3><p>{text}</p></div>
        </Col>)}
      </Row>
      <div className={styles.contact}>
        <h2>Let’s find your next favorite.</h2>
        <p className='text-muted'>Need a hand choosing a piece or have a question about your order?</p>
        <Link to='/contact' className='btn btn-outline-dark px-4'>Contact us</Link>
      </div>
    </Container>
  </>;
}
