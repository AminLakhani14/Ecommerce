import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Container,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useGetProductDetailsQuery } from "../redux/slices/productsApiSlice";
import { addToCart } from "../redux/slices/cartSlice";
import Loader from "../components/Loader";
// import Message from '../components-Message';
import QuantityCounter from "../components/QuantityCounter";
import MessageModal from "../components/MessageModal";

const ProductPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const serverUrl = 'http://localhost:5000';

  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [currentStock, setCurrentStock] = useState(0);

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showErrorModal = (message) => {
    setModalMessage(message);
    setModalShow(true);
  };

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  useEffect(() => {
    if (product) {
      setMainImage(product.image);
      // Pre-select the first available size for a better user experience
      const firstAvailableVariant = product.variants?.find((v) => v.stock > 0);
      if (firstAvailableVariant) {
        setSelectedSize(firstAvailableVariant.size);
      }
    }
  }, [product]);

  useEffect(() => {
    if (selectedSize && product) {
      const variant = product.variants.find((v) => v.size === selectedSize);
      setCurrentStock(variant ? variant.stock : 0);
      setQty(1);
    } else {
      // If no size is selected, calculate total stock of all variants
      const totalStock =
        product?.variants.reduce((sum, v) => sum + v.stock, 0) || 0;
      setCurrentStock(totalStock);
    }
  }, [selectedSize, product]);

  // --- START: THE FINAL, BULLETPROOF FIX ---
  const addToCartHandler = () => {
    // Validation Check 1: Make sure the product data has loaded.
    if (!product) {
      showErrorModal("Product data is still loading. Please wait a moment.");
      return;
    }

    // Validation Check 2: If the product has variants, a size MUST be selected.
    if (product.variants && product.variants.length > 0 && !selectedSize) {
      showErrorModal("Please select a size before adding to cart.");
      return;
    }

    // If all checks pass, create the item object.
    const itemToAdd = {
      ...product, // Spread all product properties
      qty: qty, // Add the selected quantity
      size: selectedSize, // Add the selected size (will be null if product has no variants)
    };

    // Dispatch the complete item to the cart.
    dispatch(addToCart(itemToAdd));
    navigate("/cart");
  };
  // --- END: THE FINAL, BULLETPROOF FIX ---

  return (
    <Container className="my-5">
      <Link className="btn btn-light mb-4" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        error
      ) : (
        // <Message variant='danger'>{error.data?.message || error.error}</Message>
        <Row>
          <Col md={6}>
            <Image
              src={`${serverUrl}${mainImage}`}
              alt={product.name}
              fluid
              className="mb-3 rounded shadow-sm"
            />
            <Row>
              {[product.image, ...product.gallery]
                .flat()
                .filter(Boolean)
                .map((img, index) => (
                  <Col xs={3} key={index} className="mb-2">
                    <Image
                      src={`${serverUrl}${img}`}
                      alt={`thumbnail-${index}`}
                      fluid
                      thumbnail
                      onClick={() => setMainImage(img)}
                      style={{
                        cursor: "pointer",
                        border:
                          mainImage === img
                            ? "2px solid #007bff"
                            : "1px solid #ddd",
                      }}
                    />
                  </Col>
                ))}
            </Row>
          </Col>
          <Col md={6}>
            <ListGroup variant="flush">
              <ListGroup.Item as="h3">{product.name}</ListGroup.Item>
              <ListGroup.Item>
                <p className="lead">{product.description}</p>
              </ListGroup.Item>
            </ListGroup>
            <Card className="mt-3">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>PKR {product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.variants && product.variants.length > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col as="strong">Size:</Col>
                      <Col className="d-flex flex-wrap gap-2">
                        {product.variants.map(
                          (variant) =>
                            variant.stock > 0 && (
                              <Button
                                key={variant.size}
                                variant={
                                  selectedSize === variant.size
                                    ? "dark"
                                    : "outline-dark"
                                }
                                onClick={() => setSelectedSize(variant.size)}
                                size="sm"
                              >
                                {variant.size}
                              </Button>
                            ),
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>{currentStock > 0 ? "In Stock" : "Out of Stock"}</Col>
                  </Row>
                </ListGroup.Item>
                {currentStock > 0 && (
                  <ListGroup.Item>
                    <Row className="align-items-center">
                      <Col>Qty:</Col>
                      <Col>
                        <QuantityCounter
                          value={qty}
                          setValue={setQty}
                          max={currentStock}
                        />
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      onClick={addToCartHandler}
                      type="button"
                      disabled={currentStock === 0}
                    >
                      Add To Cart
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
      <MessageModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        title="Cart Notification"
        message={modalMessage}
      />
    </Container>
  );
};

export default ProductPage;
