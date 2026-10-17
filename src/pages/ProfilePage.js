import { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col, Tab, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useUpdateProfileMutation } from '../redux/slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../redux/slices/orderApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import styles from './styles/ProfilePage.module.css'; // <-- Import the new stylesheet
import MessageModal from '../components/MessageModal';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalShow(true);
  };

  const { userInfo } = useSelector((state) => state.auth);
  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useUpdateProfileMutation();
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showModal('Error', 'Passwords do not match');
    } else {
      try {
        const res = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        showModal('Success', 'Profile updated successfully');
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        showModal('Error', err?.data?.message || err.error || 'Profile update failed');
      }
    }
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">User Profile</h1>
      <div className={styles.profileContainer}>
        <Tab.Container id="profile-tabs" defaultActiveKey="details">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className={`flex-column ${styles.tabNav}`}>
                <Nav.Item><Nav.Link eventKey="details">My Details</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="orders">My Orders</Nav.Link></Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                {/* Details Tab */}
                <Tab.Pane eventKey="details">
                  <div className={styles.formWrapper}>
                    <h2>Update Profile</h2>
                    <Form onSubmit={submitHandler}>
                      <Form.Group className='my-3' controlId='name'>
                        <Form.Label className={styles.formLabel}>Name</Form.Label>
                        <Form.Control type='text' value={name} onChange={(e) => setName(e.target.value)} className={styles.formInput} />
                      </Form.Group>
                      <Form.Group className='my-3' controlId='email'>
                        <Form.Label className={styles.formLabel}>Email Address</Form.Label>
                        <Form.Control type='email' value={email} onChange={(e) => setEmail(e.target.value)} className={styles.formInput} />
                      </Form.Group>
                      <Form.Group className='my-3' controlId='password'>
                        <Form.Label className={styles.formLabel}>New Password</Form.Label>
                        <Form.Control type='password' placeholder='Enter new password' value={password} onChange={(e) => setPassword(e.target.value)} className={styles.formInput} />
                      </Form.Group>
                      <Form.Group className='my-3' controlId='confirmPassword'>
                        <Form.Label className={styles.formLabel}>Confirm New Password</Form.Label>
                        <Form.Control type='password' placeholder='Confirm new password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={styles.formInput} />
                      </Form.Group>
                      <Button type='submit' variant='dark' className={styles.updateButton}>Update</Button>
                      {loadingUpdateProfile && <Loader />}
                    </Form>
                  </div>
                </Tab.Pane>
                
                {/* Orders Tab */}
                <Tab.Pane eventKey="orders">
                  <div className={styles.formWrapper}>
                    <h2>My Orders</h2>
                    {loadingOrders ? <Loader /> : errorOrders ? <Message variant='danger'>{errorOrders?.data?.message || errorOrders.error}</Message> : (
                      <Table striped hover responsive className='table-sm'>
                        <thead><tr><th>ID</th><th>DATE</th><th>TOTAL</th><th>PAID</th><th>DELIVERED</th><th></th></tr></thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order._id}>
                              <td>{order._id}</td>
                              <td>{order.createdAt.substring(0, 10)}</td>
                              <td>{order.totalPrice}</td>
                              <td>{order.isPaid ? order.paidAt.substring(0, 10) : <FaTimes style={{ color: 'red' }} />}</td>
                              <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : <FaTimes style={{ color: 'red' }} />}</td>
                              <td><LinkContainer to={`/order/${order._id}`}><Button className='btn-sm' variant='light'>Details</Button></LinkContainer></td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
      <MessageModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={modalTitle}
        message={modalMessage}
      />
    </Container>
  );
};

export default ProfilePage;