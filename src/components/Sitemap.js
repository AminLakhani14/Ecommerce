import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { sitemapData } from '../data/sitemapData';
import styles from './Sitemap.module.css';

const Sitemap = () => {
  return (
    <div className={styles.sitemapWrapper}>
      <Container>
        <Row>
          {sitemapData.map((column) => (
            <Col key={column.title} xs={12} sm={6} md={3} className="mb-4">
              <h5 className={styles.columnTitle}>{column.title}</h5>
              <ul className="list-unstyled">
                {column.links.map((link) => (
                  <li key={link.name} className="mb-2">
                    <Link to={link.path} className={styles.sitemapLink}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Sitemap;