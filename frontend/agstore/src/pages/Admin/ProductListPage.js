import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useGetProductsQuery, useDeleteProductMutation } from '../../redux/slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const ProductListPage = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  // --- START: THIS IS THE FIX ---
  // The handler is now an async function to properly await the API call.
  const deleteHandler = async (id) => {
    // A confirmation dialog is a good practice.
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // We call the mutation and '.unwrap()' it.
        // '.unwrap()' will throw an error if the API call fails.
        await deleteProduct(id).unwrap();
        
        // After a successful deletion, we refetch the product list.
        // This will cause the component to re-render with the updated list.
        refetch();
        alert('Product deleted successfully');
      } catch (err) {
        // If unwrap throws an error, we catch it here and show an alert.
        alert(err?.data?.message || err.error || 'Failed to delete product');
      }
    }
  };
  // --- END: THIS IS THE FIX ---

  return (
    <>
      <Row className='align-items-center'>
        <Col><h1>Products</h1></Col>
        <Col className='text-end'>
          <LinkContainer to='/admin/product/create'>
            <Button className='my-3'><FaPlus /> Create Product</Button>
          </LinkContainer>
        </Col>
      </Row>

      {/* Show a loader specifically for the delete action */}
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data?.message || error.error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>PKR {product.price}</td>
                <td>{product.category}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant='light' className='btn-sm mx-2'>
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(product._id)}
                    disabled={loadingDelete} // Disable button during deletion
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ProductListPage;