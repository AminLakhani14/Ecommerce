import SearchDialog from '../components/SearchDialog';
import { FiSearch } from 'react-icons/fi';
import { useGetCategoriesQuery } from '../redux/slices/categoriesApiSlice';
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
  const { data: categories = [] } = useGetCategoriesQuery();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDesktop, setDesktop] = useState(window.innerWidth >= 1200);

  const updateMedia = () => {
    setDesktop(window.innerWidth >= 1200);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

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
    <header className='store-header' onMouseLeave={handleMouseLeave}>
      <div className='announcement-bar'><div className='container'><span>THE EVERYDAY EDIT</span><span>Considered essentials. Effortless style.</span><LinkContainer to='/about'><a>Discover AG-Store</a></LinkContainer></div></div>
      <Navbar 
        bg="light" 
        variant="light" 
        expand="xl"
        className="store-navbar"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        <Container>
          <LinkContainer to='/' onClick={closeAllMenus}>
            <Navbar.Brand>
              {/* <img src={logo} alt='AG-Store' style={{ height: '40px', marginRight: '10px' }} />  */}
              <span className='brand-mark' aria-hidden='true'>AG</span><strong>AG-Store</strong>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="store-categories me-auto ms-xl-4">
              <LinkContainer to='/about' onClick={closeAllMenus}>
                <Nav.Link onMouseEnter={() => handleMouseEnter(null)}>About Us</Nav.Link>
              </LinkContainer>
              {categories.map(category => {
                const menuName = Object.keys(megaMenuData).find(name => name.toLowerCase() === category.toLowerCase());
                return (
                  <LinkContainer key={category} to={`/category/${encodeURIComponent(category.toLowerCase())}`}
                    onClick={closeAllMenus}>
                    <Nav.Link onMouseEnter={() => handleMouseEnter(menuName || null)}>{category}</Nav.Link>
                  </LinkContainer>
                );
              })}
              <LinkContainer to='/sale' onClick={closeAllMenus}>
                <Nav.Link className="text-danger" onMouseEnter={() => handleMouseEnter(null)}><strong>Sale</strong></Nav.Link>
              </LinkContainer>
              {/* --- END: UPDATED NAV LINKS --- */}
            </Nav>
            <Nav className='store-account-nav'>
              <button className='icon-button' aria-label='Search the store' onClick={() => { closeAllMenus(); setSearchOpen(true); }}><FiSearch /></button>
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
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/productlist' onClick={closeAllMenus}><NavDropdown.Item>Products</NavDropdown.Item></LinkContainer>
                  <LinkContainer to='/admin/orderlist' onClick={closeAllMenus}><NavDropdown.Item>Orders</NavDropdown.Item></LinkContainer>
                  <LinkContainer to='/admin/settings' onClick={closeAllMenus}><NavDropdown.Item>Settings</NavDropdown.Item></LinkContainer>
                </NavDropdown>
              )}
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile' onClick={closeAllMenus}><NavDropdown.Item>Profile</NavDropdown.Item></LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login' onClick={closeAllMenus}><Nav.Link><FaUser /> Sign In</Nav.Link></LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {/* Pass the 'closeAllMenus' function to the MegaMenu */}
      {activeMenu && <MegaMenu menuData={megaMenuData[activeMenu as keyof typeof megaMenuData]} mainCategory={activeMenu} closeAllMenus={closeAllMenus} />}
      <SearchDialog show={searchOpen} onHide={() => setSearchOpen(false)} />
    </header>
  );
};

export default Header;
