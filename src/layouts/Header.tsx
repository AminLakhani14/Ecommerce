import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useAppDispatch as useDispatch, useAppSelector as useSelector } from '../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { logout } from '../redux/slices/authSlice';
// import logo from '../assets/images/logo.png';
import MegaMenu from '../components/MegaMenu';
import { megaMenuData } from '../data/menuData';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isDesktop, setDesktop] = useState(window.innerWidth >= 1200);

  const updateMedia = () => {
    setDesktop(window.innerWidth >= 1200);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  // --- START: NEW, SMARTER EVENT HANDLERS ---
  
  // This function closes BOTH the hamburger menu and the mega menu.
  const closeAllMenus = () => {
    setExpanded(false);
    setActiveMenu(null);
  };

  // Handler for top-level menu items like Men, Women, Children
  const handleMegaMenuToggle = (e: React.MouseEvent, menuName: string) => {
    // On mobile, a click should toggle the mega menu.
    if (!isDesktop) {
      e.preventDefault(); // Prevent navigating to the main category page
      setActiveMenu(activeMenu === menuName ? null : menuName);
    }
    // On desktop, do nothing on click. Hover is handled separately.
  };

  // Handler for hovering on desktop
  const handleMouseEnter = (menuName: string | null) => {
    if (isDesktop) {
      setActiveMenu(menuName);
    }
  };

  // Handler for leaving the entire header area
  const handleMouseLeave = () => {
    if (isDesktop) {
      setActiveMenu(null);
    }
  };

  const logoutHandler = async () => {
    closeAllMenus();
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) { console.error(err); }
  };
  // --- END: NEW, SMARTER EVENT HANDLERS ---

  return (
    <header style={{ position: 'relative' }} onMouseLeave={handleMouseLeave}>
      <Navbar 
        bg="light" 
        variant="light" 
        expand="xl"
        className="shadow-sm"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        <Container>
          <LinkContainer to='/' onClick={closeAllMenus}>
            <Navbar.Brand>
              {/* <img src={logo} alt='AG-Store' style={{ height: '40px', marginRight: '10px' }} />  */}
              <strong>AG-Store</strong>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <LinkContainer to='/about' onClick={closeAllMenus}>
                <Nav.Link onMouseEnter={() => handleMouseEnter(null)}>About Us</Nav.Link>
              </LinkContainer>
              {/* --- START: UPDATED NAV LINKS WITH CLICK LOGIC --- */}
              <LinkContainer 
                to='/category/men'
                onClick={(e) => handleMegaMenuToggle(e, 'Men')}
              >
                <Nav.Link onMouseEnter={() => handleMouseEnter('Men')}>Men</Nav.Link>
              </LinkContainer>
              <LinkContainer 
                to='/category/women'
                onClick={(e) => handleMegaMenuToggle(e, 'Women')}
              >
                <Nav.Link onMouseEnter={() => handleMouseEnter('Women')}>Women</Nav.Link>
              </LinkContainer>
              <LinkContainer 
                to='/category/children'
                onClick={(e) => handleMegaMenuToggle(e, 'Children')}
              >
                <Nav.Link onMouseEnter={() => handleMouseEnter('Children')}>Children</Nav.Link>
              </LinkContainer>
              
              {/* These links behave normally and close all menus */}
              <LinkContainer to='/category/accessories' onClick={closeAllMenus}>
                <Nav.Link onMouseEnter={() => handleMouseEnter(null)}>Accessories</Nav.Link>
              </LinkContainer>
              <LinkContainer to='/category/backpacks' onClick={closeAllMenus}>
                <Nav.Link onMouseEnter={() => handleMouseEnter(null)}>Backpacks</Nav.Link>
              </LinkContainer>
              <LinkContainer to='/category/clothing' onClick={closeAllMenus}>
                <Nav.Link onMouseEnter={() => handleMouseEnter(null)}>Clothing</Nav.Link>
              </LinkContainer>
              <LinkContainer to='/sale' onClick={closeAllMenus}>
                <Nav.Link className="text-danger" onMouseEnter={() => handleMouseEnter(null)}><strong>Sale</strong></Nav.Link>
              </LinkContainer>
              {/* --- END: UPDATED NAV LINKS --- */}
            </Nav>
            <Nav>
              <LinkContainer to='/cart' onClick={closeAllMenus}>
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                 <NavDropdown title={userInfo.name} id='username'>
                 <LinkContainer to='/profile' onClick={closeAllMenus}><NavDropdown.Item>Profile</NavDropdown.Item></LinkContainer>
                 <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
               </NavDropdown>
              ) : (
                <LinkContainer to='/login' onClick={closeAllMenus}><Nav.Link><FaUser /> Sign In</Nav.Link></LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/productlist' onClick={closeAllMenus}><NavDropdown.Item>Products</NavDropdown.Item></LinkContainer>
                  <LinkContainer to='/admin/orderlist' onClick={closeAllMenus}><NavDropdown.Item>Orders</NavDropdown.Item></LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {/* Pass the 'closeAllMenus' function to the MegaMenu */}
      {activeMenu && <MegaMenu menuData={megaMenuData[activeMenu as keyof typeof megaMenuData]} mainCategory={activeMenu} closeAllMenus={closeAllMenus} />}
    </header>
  );
};

export default Header;
