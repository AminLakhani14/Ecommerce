import { formatUSD } from '../../utils/currency';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { FiArrowLeft, FiArrowRight, FiBox, FiCheckCircle, FiEdit2, FiPackage, FiPlus, FiSearch, FiSettings, FiTag, FiTrash2 } from 'react-icons/fi';
import { useGetAdminProductsQuery, useDeleteProductMutation } from '../../redux/slices/productsApiSlice';
import { productCategories } from '../../utils/categories';
import { productImageUrl } from '../../utils/productImage';
import { getErrorMessage } from '../../utils/getErrorMessage';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import MessageModal from '../../components/MessageModal';
import type { Product } from '../../types';

const stock = (product: Product) => product.variants.reduce((total, variant) => total + variant.stock, 0);
const pageSize = 10;

export default function ProductListPage() {
  const { data: products = [], isLoading, error } = useGetAdminProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const categories = useMemo(() => [...new Set(products.flatMap(product => productCategories(product.category)))].sort(), [products]);
  const filtered = useMemo(() => products.filter(product =>
    `${product.name} ${product.subCategory} ${productCategories(product.category).join(' ')}`.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'all' || productCategories(product.category).includes(category)) &&
    (filter === 'all' || (filter === 'sale' ? product.isOnSale : stock(product) === 0))
  ).sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : a.name.localeCompare(b.name)), [products, search, category, filter, sort]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageProducts = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const available = products.filter(product => stock(product) > 0).length;
  const sale = products.filter(product => product.isOnSale).length;
  const stats = [{ label: 'Total products', value: products.length, icon: FiBox, color: 'neutral' }, { label: 'In stock', value: available, icon: FiCheckCircle, color: 'green' }, { label: 'On sale', value: sale, icon: FiTag, color: 'purple' }, { label: 'Out of stock', value: products.length - available, icon: FiPackage, color: 'amber' }];
  const remove = async () => {
    if (!pendingDelete) return;
    try { await deleteProduct(pendingDelete._id).unwrap(); setPendingDelete(null); }
    catch (error) { setDeleteError(getErrorMessage(error)); }
  };
  const resetFilters = () => { setSearch(''); setCategory('all'); setFilter('all'); setPage(1); };

  return <>
    <div className='page-heading'><div><p className='eyebrow'>PRODUCT MANAGEMENT</p><h1>Products</h1><p>Your catalog, beautifully organized. Manage every product in one place.</p></div><div className='heading-actions'><Link to='/admin/settings' className='button-subtle'><FiSettings /> Categories</Link><Link to='/admin/product/create' className='btn btn-dark'><FiPlus /> Create Product</Link></div></div>
    <div className='catalog-stats'>{stats.map(item => <div className='catalog-stat' key={item.label}><div><span>{item.label}</span><strong>{isLoading ? '?' : item.value}</strong></div><span className={`stat-icon ${item.color}`}><item.icon /></span></div>)}</div>
    <section className='catalog-panel'>
      <div className='catalog-tabs' role='group' aria-label='Product status filter'>{[{ key: 'all', label: 'All products', count: products.length }, { key: 'sale', label: 'On sale', count: sale }, { key: 'empty', label: 'Out of stock', count: products.length - available }].map(tab => <button type='button' key={tab.key} aria-pressed={filter === tab.key} className={filter === tab.key ? 'active' : ''} onClick={() => { setFilter(tab.key); setPage(1); }}>{tab.label}<span>{tab.count}</span></button>)}</div>
      <div className='catalog-toolbar'><div className='search-field'><FiSearch /><Form.Control type='search' aria-label='Search products' placeholder='Search by product name or category' value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} /></div><div className='catalog-filter-controls'><Form.Select aria-label='Filter by category' value={category} onChange={event => { setCategory(event.target.value); setPage(1); }}><option value='all'>All categories</option>{categories.map(name => <option key={name}>{name}</option>)}</Form.Select><Form.Select aria-label='Sort products' value={sort} onChange={event => { setSort(event.target.value); setPage(1); }}><option value='name'>Name: A to Z</option><option value='price-low'>Price: low to high</option><option value='price-high'>Price: high to low</option></Form.Select></div></div>
      {isLoading ? <div className='catalog-loading'><Loader /></div> : error ? <div className='p-4'><Message variant='danger'>{getErrorMessage(error)}</Message></div> : filtered.length ? <>
        <div className='catalog-table-scroll'><table className='catalog-table'><caption className='visually-hidden'>Product catalog</caption><thead><tr><th>Product</th><th>Status</th><th>Inventory</th><th>Categories</th><th>Price</th><th className='text-end'>Actions</th></tr></thead><tbody>
          {pageProducts.map(product => <tr key={product._id}>
            <td><Link className='catalog-product' to={`/admin/product/${product._id}/edit`}><img src={productImageUrl(product.image)} alt='' loading='lazy' /><span><strong>{product.name}</strong><small>{product.subCategory}</small></span></Link></td>
            <td><span className={`status-pill ${(product.isActive === false || !productCategories(product.category).length) ? 'neutral' : 'green'}`}><i />{(product.isActive === false || !productCategories(product.category).length) ? 'Hidden' : 'Active'}</span></td>
            <td><span className={`inventory-value ${stock(product) === 0 ? 'empty' : stock(product) < 6 ? 'low' : ''}`}><i />{stock(product) > 0 ? `${stock(product)} available` : 'Out of stock'}</span><small className='inventory-options'>{product.variants.length} option{product.variants.length === 1 ? '' : 's'}</small></td>
            <td><div className='category-chips'>{productCategories(product.category).length ? productCategories(product.category).map(name => <span key={name}>{name}</span>) : <span>No category assigned</span>}</div></td>
            <td><strong className='catalog-price'>{formatUSD(product.price)}</strong>{product.isOnSale && <small className='sale-note'><FiTag /> On sale</small>}</td>
            <td><div className='row-actions'><Link to={`/admin/product/${product._id}/edit`} className='icon-button' aria-label={`Edit ${product.name}`} title='Edit product'><FiEdit2 /></Link><button className='icon-button danger' aria-label={`Delete ${product.name}`} title='Delete product' disabled={isDeleting} onClick={() => { setDeleteError(''); setPendingDelete(product); }}><FiTrash2 /></button></div></td>
          </tr>)}
        </tbody></table></div>
        <div className='catalog-pagination'><p>Showing <strong>{(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> products</p><div><button className='pagination-arrow' aria-label='Previous page' disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><FiArrowLeft /></button>{Array.from({ length: Math.min(totalPages, 5) }, (_value, index) => Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + index).map(value => <button key={value} aria-label={`Page ${value}`} aria-current={value === currentPage ? 'page' : undefined} onClick={() => setPage(value)}>{value}</button>)}<button className='pagination-arrow' aria-label='Next page' disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}><FiArrowRight /></button></div></div>
      </> : <div className='catalog-empty'><FiSearch /><h2>{products.length ? 'No matching products' : 'Your catalog starts here'}</h2><p>{products.length ? 'Try another search or adjust your filters.' : 'Add your first product and bring your storefront to life.'}</p>{products.length ? <Button variant='outline-dark' onClick={resetFilters}>Clear filters</Button> : <Link to='/admin/product/create' className='btn btn-dark'><FiPlus /> Create Product</Link>}</div>}
    </section>
    <MessageModal show={!!pendingDelete} onHide={() => { if (!isDeleting) setPendingDelete(null); }} title={deleteError ? 'Unable to delete product' : 'Delete product?'} message={deleteError || `Delete "${pendingDelete?.name}" from your catalog? This action cannot be undone.`} type={deleteError ? 'alert' : 'confirm'} onConfirm={isDeleting ? undefined : remove} />
  </>;
}
