import { LinkContainer } from "react-router-bootstrap";
import { Container, Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../redux/slices/productsApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import MessageModal from "../../components/MessageModal";

import { useState } from "react";

const ProductListPage = () => {
  // The 'refetch' function is no longer needed here.
  const { data: products, isLoading, error } = useGetProductsQuery();
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('alert');
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  const deleteHandler = (id) => {
    setProductIdToDelete(id);
    setModalTitle('Confirm Delete');
    setModalMessage('Are you sure you want to delete this product? This action cannot be undone.');
    setModalType('confirm');
    setModalShow(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(productIdToDelete).unwrap();
      setModalShow(false);
    } catch (err) {
      setModalType('alert');
      setModalTitle('Error');
      setModalMessage(err?.data?.message || err.error || "Failed to delete product");
    }
  };

  const handleModalClose = () => {
    setModalShow(false);
    setProductIdToDelete(null);
  };

  return (
    <>
      <Container className="my-5">
        <Row className="align-items-center">
          <Col>
            <h1>Products</h1>
          </Col>
          <Col className="text-end">
            <LinkContainer to="/admin/product/create">
              <Button variant="dark" className="my-3">
                <FaPlus /> Create Product
              </Button>
            </LinkContainer>
          </Col>
        </Row>

        {loadingDelete && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error.data?.message || error.error}
          </Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>PKR {product.price}</td>
                  <td>{product.category}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                      disabled={loadingDelete}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>

      <MessageModal
        show={modalShow}
        onHide={handleModalClose}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default ProductListPage;
