import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useGetProductsQuery, useDeleteProductMutation } from '../../redux/slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const ProductListPage = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        refetch(); // Refetch the product list
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

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
      {loadingDelete && <Loader />}
      {isLoading ? <Loader /> : error ? <Message variant='danger'>{error.data.message}</Message> : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>NAME</th><th>PRICE</th><th>CATEGORY</th><th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.name}>
                <td>{product.name}</td>
                <td>PKR {product.price}</td>
                <td>{product.category}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant='light' className='btn-sm mx-2'><FaEdit /></Button>
                  </LinkContainer>
                  <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}><FaTrash /></Button>
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