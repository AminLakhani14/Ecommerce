import { Navbar, Nav, Container,Badge, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { logout } from '../redux/slices/authSlice';
// import logo from '../assets/images/logo.png';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) { console.error(err); }
  };

  return (
    <header>
      <Navbar bg="light" variant="light" expand="lg" collapseOnSelect className="shadow-sm">
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              {/* <img src={logo} alt='AG-Store's style={{ height: '40px', marginRight: '10px' }} /> */}
              <strong>AG-Store</strong>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">       
              <LinkContainer to='/category/men'><Nav.Link>Men</Nav.Link></LinkContainer>
              <LinkContainer to='/category/women'><Nav.Link>Women</Nav.Link></LinkContainer>
              <LinkContainer to='/category/children'><Nav.Link>Children</Nav.Link></LinkContainer>
              <LinkContainer to='/sale'><Nav.Link className="text-danger"><strong>Sale</strong></Nav.Link></LinkContainer>
            </Nav>
            <Nav>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'><NavDropdown.Item>Profile</NavDropdown.Item></LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
              <LinkContainer to='/login'><Nav.Link><FaUser /> Sign In</Nav.Link></LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/productlist'>
                      <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
            <Nav>       
            <LinkContainer to='/cart'>
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;