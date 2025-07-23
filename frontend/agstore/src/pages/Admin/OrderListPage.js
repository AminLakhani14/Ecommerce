import { Table, Button, Tab, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetOrdersQuery, useDeliverOrderMutation, useCancelOrderMutation } from '../../redux/slices/orderApiSlice';
import styles from '../styles/OrderListPage.module.css'; // <-- Import the new stylesheet

const OrderListPage = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [cancelOrder, { isLoading: loadingCancel }] = useCancelOrderMutation();

  const deliverHandler = async (id) => {
    if (window.confirm('Mark this order as complete/delivered?')) {
      try {
        await deliverOrder(id).unwrap();
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  const cancelHandler = async (id) => {
    if (window.confirm('Are you sure you want to cancel this order? This will restock the items.')) {
      try {
        await cancelOrder(id).unwrap();
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  const activeOrders = orders ? orders.filter(order => !order.isDelivered && !order.isCancelled) : [];
  const completedOrders = orders ? orders.filter(order => order.isDelivered) : [];
  const cancelledOrders = orders ? orders.filter(order => order.isCancelled) : [];

  // --- START: NEW RESPONSIVE RENDER LOGIC ---
  const renderOrderList = (orderList, tabType) => (
    <>
      {/* Desktop View: Table (visible on medium screens and up) */}
      <div className="d-none d-md-block">
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr><th>ID</th><th>USER</th><th>DATE</th><th>TOTAL</th><th>PAID</th>{tabType !== 'cancelled' && <th>ACTIONS</th>}</tr>
          </thead>
          <tbody>
            {orderList.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>PKR {order.totalPrice}</td>
                <td>{order.isPaid ? <FaCheck style={{ color: 'green' }} /> : <FaTimes style={{ color: 'red' }} />}</td>
                {tabType !== 'cancelled' && (
                  <td>
                    <LinkContainer to={`/order/${order._id}`}><Button variant='light' className='btn-sm'>Details</Button></LinkContainer>
                    {tabType === 'active' && (
                      <>
                        <Button variant='success' className='btn-sm mx-2' onClick={() => deliverHandler(order._id)}>Complete</Button>
                        <Button variant='danger' className='btn-sm' onClick={() => cancelHandler(order._id)}>Cancel</Button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Mobile View: Cards (visible on small screens and down) */}
      <div className="d-block d-md-none">
        {orderList.map((order) => (
          <div key={order._id} className={styles.orderCard}>
            <div className={styles.cardHeader}>
              <span className={styles.orderId}>ID: {order._id.substring(order._id.length - 6)}</span>
              <span className={styles.orderDate}>{order.createdAt.substring(0, 10)}</span>
            </div>
            <div className={styles.cardBody}>
              <p><strong>User:</strong> {order.user?.name || 'N/A'}</p>
              <p><strong>Total:</strong> PKR {order.totalPrice}</p>
              <p><strong>Paid:</strong> 
                <span className={`${styles.statusBadge} ${order.isPaid ? styles.statusPaid : styles.statusNotPaid}`}>
                  {order.isPaid ? 'Yes' : 'No'}
                </span>
              </p>
            </div>
            {tabType !== 'cancelled' && (
              <div className={styles.cardActions}>
                <LinkContainer to={`/order/${order._id}`}><Button variant='secondary' size='sm'>Details</Button></LinkContainer>
                {tabType === 'active' && (
                  <>
                    <Button variant='success' size='sm' onClick={() => deliverHandler(order._id)}>Complete</Button>
                    <Button variant='danger' size='sm' onClick={() => cancelHandler(order._id)}>Cancel</Button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
  // --- END: NEW RESPONSIVE RENDER LOGIC ---

  return (
    <Container className="my-5">
      <h1 className="mb-4">Order Management</h1>
      {(loadingDeliver || loadingCancel) && <Loader />}
      {isLoading ? <Loader /> : error ? <Message variant='danger'>{error.data.message}</Message> : (
        <Tab.Container id="order-tabs" defaultActiveKey="active">
          <Nav variant="pills" className="mb-4">
            <Nav.Item><Nav.Link eventKey="active">Active Orders</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="completed">Completed Orders</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="cancelled">Cancelled Orders</Nav.Link></Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="active">
              {activeOrders.length > 0 ? renderOrderList(activeOrders, 'active') : <Message>No active orders found.</Message>}
            </Tab.Pane>
            <Tab.Pane eventKey="completed">
              {completedOrders.length > 0 ? renderOrderList(completedOrders, 'completed') : <Message>No completed orders found.</Message>}
            </Tab.Pane>
            <Tab.Pane eventKey="cancelled">
              {cancelledOrders.length > 0 ? renderOrderList(cancelledOrders, 'cancelled') : <Message>No cancelled orders found.</Message>}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      )}
    </Container>
  );
};

export default OrderListPage;