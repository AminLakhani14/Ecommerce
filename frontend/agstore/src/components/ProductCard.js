import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const serverUrl = 'http://localhost:5000';
console.log(product)
  return (
    <Card className='my-3 p-3 rounded shadow-sm h-100'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={`${serverUrl}${product.image}`} variant='top' style={{ height: '200px', objectFit: 'contain' }} />
      </Link>
      <Card.Body className="d-flex flex-column">
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as='h3' className="mt-auto">PKR {product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;