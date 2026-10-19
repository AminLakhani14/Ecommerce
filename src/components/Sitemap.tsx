import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { sitemapData } from '../data/sitemapData';
import styles from './Sitemap.module.css';
import { useGetCategoriesQuery } from '../redux/slices/categoriesApiSlice';

const Sitemap = () => {
  const { data: categories = [] } = useGetCategoriesQuery();
  const columns = sitemapData.map(column => ({ ...column, links: column.links.filter(link => {
    const category = decodeURIComponent(link.path.split('/')[2]).toLowerCase();
    return categories.some(name => name.toLowerCase() === category);
  }) })).filter(column => column.links.length > 0);
  const represented = new Set(columns.flatMap(column => column.links.map(link => decodeURIComponent(link.path.split('/')[2]).toLowerCase())));
  const extra = categories.filter(name => !represented.has(name.toLowerCase()));
  if (extra.length) columns.push({ title: 'More collections', links: extra.map(name => ({ name, path: `/category/${encodeURIComponent(name.toLowerCase())}` })) });
  if (!columns.length) return null;
  return <section className={styles.sitemapWrapper} aria-label='Explore our collections'>
    <Container className={styles.layout}>
      <div className={styles.introduction}>
        <p className='eyebrow'>THE EVERYDAY EDIT</p>
        <h2>A little more <br />to explore.</h2>
        <p>Find the pieces that make your everyday feel like you.</p>
        <Link to='/sale' className={styles.saleLink}>Discover the sale edit <FiArrowUpRight aria-hidden='true' /></Link>
      </div>
      <div className={`${styles.columns} ${columns.length === 1 ? styles.singleColumn : ''}`}>
        {columns.map(column => <div key={column.title} className={styles.categoryColumn}>
          <h5 className={styles.columnTitle}>{column.title}</h5>
          <ul className={styles.linkList}>{column.links.map(link => <li key={link.path}>
            <Link to={link.path} className={styles.sitemapLink}><span>{link.name}</span><FiArrowUpRight aria-hidden='true' /></Link>
          </li>)}</ul>
        </div>)}
      </div>
    </Container>
  </section>;
};
export default Sitemap;
