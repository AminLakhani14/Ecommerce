import PriceTag from '../components/PriceTag';
import { productPath } from '../utils/productPath';
import { productImageUrl } from '../utils/productImage';
import { getErrorMessage } from '../utils/getErrorMessage';
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import Message from '../components/Message';
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form } from "react-bootstrap";
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { FiArrowLeft, FiCheckCircle, FiEdit3, FiRefreshCw, FiShield, FiShoppingBag, FiTruck } from 'react-icons/fi';
import { useAppDispatch as useDispatch, useAppSelector as useSelector } from '../redux/hooks';
import {
  useGetProductDetailsQuery,
  useGetProductReviewsQuery,
  useGetReviewEligibilityQuery,
  useCreateReviewMutation,
  useGetRelatedProductsQuery,
} from "../redux/slices/productsApiSlice";
import { addToCart } from "../redux/slices/cartSlice";
import Loader from "../components/Loader";
import QuantityCounter from "../components/QuantityCounter";
import MessageModal from "../components/MessageModal";
import ProductCard from "../components/ProductCard";
import styles from './styles/ProductPage.module.css';

const Stars = ({ value, size = 14 }: { value: number; size?: number }) => (
  <span className={styles.stars} aria-label={`${value} out of 5 stars`} style={{ fontSize: size }}>
    {[1, 2, 3, 4, 5].map((n) =>
      value >= n ? <FaStar key={n} /> : value >= n - 0.5 ? <FaStarHalfAlt key={n} /> : <FaRegStar key={n} />,
    )}
  </span>
);

const ReviewForm = ({ productId, onCancel }: { productId: string; onCancel: () => void }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [createReview, { isLoading, error }] = useCreateReviewMutation();

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, title, comment }).unwrap();
    } catch {
      // Error is rendered from the mutation state.
    }
  };

  return (
    <Form onSubmit={submitHandler} className={styles.reviewForm}>
      <h4>Share your thoughts</h4>
      <div className={styles.ratingPicker} onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            className={(hover || rating) >= n ? styles.ratingOn : ''}
            onMouseEnter={() => setHover(n)}
            onClick={() => setRating(n)}
          >
            <FaStar />
          </button>
        ))}
      </div>
      <Form.Control
        placeholder="Review title (optional)"
        value={title}
        maxLength={120}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2"
      />
      <Form.Control
        as="textarea"
        rows={4}
        placeholder="What did you like or dislike? How was the fit and quality?"
        value={comment}
        maxLength={2000}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      {error && <p className={styles.formError}>{getErrorMessage(error)}</p>}
      <button type="submit" className={styles.primaryButton} disabled={isLoading || !rating || comment.trim().length < 3}>
        {isLoading ? 'Posting…' : 'Post review'}
      </button>
      <button type="button" className={styles.linkButton} onClick={onCancel}>Cancel</button>
    </Form>
  );
};

const ProductPage = () => {
  const { id: productParam = '' } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState("");
  const [currentStock, setCurrentStock] = useState(0);

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showErrorModal = (message: string) => {
    setModalMessage(message);
    setModalShow(true);
  };

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productParam);
  // Reviews and suggestions are keyed by ID; the URL shows the product name.
  const productId = product?._id ?? '';
  const { data: reviewData } = useGetProductReviewsQuery(productId, { skip: !productId });
  const { data: eligibility } = useGetReviewEligibilityQuery(productId, { skip: !productId || !userInfo });
  const { data: related } = useGetRelatedProductsQuery(productId, { skip: !productId });

  // Old ID links (e.g. from order history) move to the readable name URL.
  useEffect(() => {
    if (product?.slug && productParam !== product.slug) {
      navigate(productPath(product), { replace: true });
    }
  }, [product, productParam, navigate]);

  useEffect(() => {
    if (product) {
      setMainImage(product.image);
      // Pre-select the first available size for a better user experience
      const firstAvailableVariant = product.variants?.find((v) => v.stock > 0);
      setSelectedSize(firstAvailableVariant ? firstAvailableVariant.size : null);
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

  const addToCartHandler = () => {
    if (!product) {
      showErrorModal("Product data is still loading. Please wait a moment.");
      return;
    }
    if (product.variants && product.variants.length > 0 && !selectedSize) {
      showErrorModal("Please select a size before adding to cart.");
      return;
    }
    dispatch(addToCart({ ...product, qty, size: selectedSize || '' }));
    navigate("/cart");
  };

  const [showReviewForm, setShowReviewForm] = useState(false);
  const openReviewForm = () => {
    if (!userInfo) {
      navigate(`/login?redirect=${product ? productPath(product) : `/product/${productParam}`}`);
      return;
    }
    setShowReviewForm(true);
    document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
  };

  const images = product ? [product.image, ...product.gallery].flat().filter(Boolean) : [];
  const categories = product ? [product.category].flat().filter(Boolean) : [];
  const numReviews = reviewData?.numReviews ?? 0;
  const rating = reviewData?.rating ?? 0;

  return (
    <Container className={styles.page}>
      <button type="button" className={styles.backLink} onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back
      </button>
      {isLoading ? (
        <Loader />
      ) : error || !product ? (
        <Message variant='danger'>{getErrorMessage(error)}</Message>
      ) : (
        <>
          <section className={styles.hero}>
            <div className={styles.gallery}>
              {images.length > 1 && (
                <div className={styles.thumbs}>
                  {images.map((img, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`${styles.thumb} ${mainImage === img ? styles.thumbActive : ''}`}
                      onClick={() => setMainImage(img)}
                      aria-label={`Show image ${index + 1}`}
                    >
                      <img src={productImageUrl(img)} alt="" />
                    </button>
                  ))}
                </div>
              )}
              <div className={styles.mainImage}>
                {product.isOnSale && <span className={styles.saleBadge}>Sale</span>}
                <img src={productImageUrl(mainImage || product.image)} alt={product.name} />
              </div>
            </div>

            <div className={styles.info}>
              <p className="eyebrow">
                {[...categories, product.subCategory].filter(Boolean).join(' · ')}
              </p>
              <h1 className={styles.title}>{product.name}</h1>
              <a href="#reviews" className={styles.ratingLink}>
                <Stars value={rating} />
                <span>{numReviews ? `${rating.toFixed(1)} · ${numReviews} review${numReviews > 1 ? 's' : ''}` : 'No reviews yet'}</span>
              </a>
              <p className={styles.price}><PriceTag product={product} size="lg" /></p>
              <p className={styles.description}>{product.description}</p>

              <div className={styles.purchase}>
                {product.variants && product.variants.length > 0 && (
                  <div className={styles.field}>
                    <div className={styles.fieldLabel}>
                      <span>Size</span>
                      {selectedSize && <strong>{selectedSize}</strong>}
                    </div>
                    <div className={styles.sizes}>
                      {product.variants.map((variant) => (
                        <button
                          type="button"
                          key={variant.size}
                          disabled={variant.stock <= 0}
                          className={`${styles.size} ${selectedSize === variant.size ? styles.sizeActive : ''}`}
                          onClick={() => setSelectedSize(variant.size)}
                        >
                          {variant.size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <p className={`${styles.stock} ${currentStock > 0 ? styles.inStock : styles.outStock}`}>
                  <span />
                  {currentStock > 0
                    ? currentStock <= 5 ? `Only ${currentStock} left in stock` : 'In stock, ready to ship'
                    : 'Out of stock'}
                </p>

                <div className={styles.actions}>
                  {currentStock > 0 && (
                    <QuantityCounter value={qty} setValue={setQty} max={currentStock} />
                  )}
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={addToCartHandler}
                    disabled={currentStock === 0}
                  >
                    <FiShoppingBag /> {currentStock === 0 ? 'Sold out' : 'Add to cart'}
                  </button>
                </div>
              </div>

              <ul className={styles.perks}>
                <li><FiTruck /><span><strong>Fast delivery</strong>Ships within 2–4 business days</span></li>
                <li><FiRefreshCw /><span><strong>Easy returns</strong>14-day hassle-free returns</span></li>
                <li><FiShield /><span><strong>Secure checkout</strong>Your payment details stay safe</span></li>
              </ul>
            </div>
          </section>

          <section id="reviews" className={styles.reviews}>
            <div className={`${styles.sectionHead} ${styles.sectionHeadRow}`}>
              <div>
                <p className="eyebrow">From our customers</p>
                <h2>Reviews</h2>
              </div>
              {eligibility?.reason !== 'reviewed' && !showReviewForm && (
                <button type="button" className={styles.secondaryButton} onClick={openReviewForm}>
                  <FiEdit3 /> Write a review
                </button>
              )}
            </div>
            <div className={styles.reviewsGrid}>
              <aside className={styles.summary}>
                <div className={styles.summaryScore}>
                  <strong>{numReviews ? rating.toFixed(1) : '–'}</strong>
                  <div>
                    <Stars value={rating} size={16} />
                    <span>Based on {numReviews} review{numReviews === 1 ? '' : 's'}</span>
                  </div>
                </div>
                <ul className={styles.bars}>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviewData?.distribution[star - 1] ?? 0;
                    return (
                      <li key={star}>
                        <span>{star}</span>
                        <FaStar />
                        <div className={styles.bar}>
                          <div style={{ width: numReviews ? `${(count / numReviews) * 100}%` : 0 }} />
                        </div>
                        <span>{count}</span>
                      </li>
                    );
                  })}
                </ul>

                {eligibility?.reason === 'reviewed' ? (
                  <p className={styles.reviewNote}><FiCheckCircle /> Thanks — you’ve reviewed this product.</p>
                ) : !showReviewForm ? (
                  <div className={styles.reviewNote}>
                    <p>Bought this item? Tell other shoppers what you think.</p>
                    <button type="button" className={styles.primaryButton} onClick={openReviewForm}>
                      <FiEdit3 /> Write a review
                    </button>
                  </div>
                ) : eligibility?.canReview ? (
                  <ReviewForm productId={productId} onCancel={() => setShowReviewForm(false)} />
                ) : eligibility ? (
                  <p className={styles.reviewNote}>Only customers who have purchased this item can leave a review.</p>
                ) : null}
              </aside>

              <div className={styles.reviewList}>
                {reviewData && reviewData.reviews.length === 0 && (
                  <div className={styles.emptyReviews}>
                    <Stars value={0} size={20} />
                    <p>No reviews yet. Be the first buyer to share your thoughts.</p>
                  </div>
                )}
                {reviewData?.reviews.map((review) => (
                  <article key={review._id} className={styles.review}>
                    <header>
                      <span className={styles.avatar}>{review.name.charAt(0).toUpperCase()}</span>
                      <div>
                        <strong>{review.name}</strong>
                        <span className={styles.verified}><FiCheckCircle /> Verified buyer</span>
                      </div>
                      <time dateTime={review.createdAt}>
                        {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                    </header>
                    <Stars value={review.rating} />
                    {review.title && <h4>{review.title}</h4>}
                    <p>{review.comment}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {related && related.length > 0 && (
            <section className={styles.related}>
              <div className={styles.sectionHead}>
                <p className="eyebrow">Complete the look</p>
                <h2>You may also like</h2>
              </div>
              <div className={styles.relatedGrid}>
                {related.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            </section>
          )}
        </>
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
