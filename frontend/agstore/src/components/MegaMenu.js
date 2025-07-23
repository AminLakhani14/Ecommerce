import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './MegaMenu.module.css';

// --- START: Accept the 'closeAllMenus' prop ---
const MegaMenu = ({ menuData, mainCategory, closeAllMenus }) => {
  if (!menuData) return null;

  return (
    <div className={styles.megaMenuWrapper}>
      <Container>
        <Row>
          <Col md={8}>
            <Row>
              {menuData.columns.map((column) => (
                <Col key={column.title} md={4} className={styles.menuColumn}>
                  <h5 className="text-uppercase">{column.title}</h5>
                  <ul className="list-unstyled">
                    {column.links.map((link) => (
                      <li key={link}>
                        <Link 
                          to={`/products/${encodeURIComponent(mainCategory)}/${encodeURIComponent(link)}`}
                          onClick={closeAllMenus} // <-- Call the function here
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Col>
              ))}
            </Row>
          </Col>
          <Col md={4} className={styles.featuredColumn}>
            <h5 className="text-uppercase">FEATURED</h5>
            <Row>
              {menuData.featured.map((item) => (
                <Col key={item.title} md={6}>
                  <Link to={item.link} className={styles.featuredItem} onClick={closeAllMenus}>
                    <Image src={item.imageSrc} fluid />
                    <div className={styles.featuredTitle}>{item.title}</div>
                  </Link>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
// --- END: Accept the 'closeAllMenus' prop ---

export default MegaMenu;