import { formatUSD } from '../utils/currency';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Form } from 'react-bootstrap';
import { FiArrowUpRight, FiSearch } from 'react-icons/fi';
import { useGetProductsQuery } from '../redux/slices/productsApiSlice';
import { productImageUrl } from '../utils/productImage';
import { getErrorMessage } from '../utils/getErrorMessage';
import Loader from './Loader';

export default function SearchDialog({ show, onHide }: { show: boolean; onHide: () => void }) {
  const [term, setTerm] = useState('');
  const { data: products = [], isLoading, error } = useGetProductsQuery(undefined, { skip: !show });
  const matches = term.trim() ? products.filter(product => `${product.name} ${product.subCategory} ${product.category}`.toLowerCase().includes(term.trim().toLowerCase())).slice(0, 8) : [];
  return <Modal show={show} onHide={onHide} centered className='search-dialog'>
    <Modal.Header closeButton><Modal.Title>Find your next favorite</Modal.Title></Modal.Header>
    <Modal.Body>
      <div className='search-field'><FiSearch /><Form.Control aria-label='Search products' autoFocus placeholder='Search bags, clothing, accessories…' value={term} onChange={event => setTerm(event.target.value)} /></div>
      {!term.trim() ? <p className='search-hint'>A wardrobe essential or something a little unexpected. What are you looking for?</p> : isLoading ? <Loader /> : error ? <p role='alert'>{getErrorMessage(error)}</p> : matches.length ? <div className='search-results'>
        {matches.map(product => <Link key={product._id} to={`/product/${product._id}`} onClick={onHide}>
          <img src={productImageUrl(product.image)} alt='' /><span><strong>{product.name}</strong><small>{product.subCategory} · {formatUSD(product.price)}</small></span><FiArrowUpRight />
        </Link>)}
      </div> : <p className='search-hint'>No products found for “{term}”. Try another name or category.</p>}
    </Modal.Body>
  </Modal>;
}
