import { Link, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FiArrowLeft, FiArrowRight, FiShoppingBag, FiTrash2, FiTruck } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import { formatUSD } from '../utils/currency';
import { FREE_SHIPPING_THRESHOLD } from '../utils/cartUtils';
import { productImageUrl } from '../utils/productImage';
import QuantityCounter from '../components/QuantityCounter';
import OrderSummary from '../components/OrderSummary';
import CheckoutProgress from '../components/CheckoutProgress';
import styles from './styles/Commerce.module.css';
export default function CartPage() {
  const dispatch=useAppDispatch(); const navigate=useNavigate();
  const cart=useAppSelector(state=>state.cart);
  const user=useAppSelector(state=>state.auth.userInfo);
  const count=cart.cartItems.reduce((total,item)=>total+item.qty,0);
  const freeShipping=Number(cart.shippingPrice)===0;
  const remaining=Math.max(FREE_SHIPPING_THRESHOLD-cart.itemsPrice,0);
  const progress=freeShipping?100:Math.min(99,cart.itemsPrice/FREE_SHIPPING_THRESHOLD*100);
  return <Container className={styles.page}>
    <div className={styles.pageHeader}><div><p className='eyebrow'>YOUR EVERYDAY FINDS</p><h1>Your shopping bag<span>{count}</span></h1><p>A good choice looks even better together.</p></div><Link to='/' className={styles.backLink}><FiArrowLeft /> Continue shopping</Link></div>
    {cart.cartItems.length?<>
      <CheckoutProgress current={1} />
      <div className={styles.layout}>
        <section className={styles.bagPanel} aria-label='Shopping bag items'>
          <div className={`${styles.shippingMeter} ${freeShipping?styles.shippingUnlocked:''}`}>
            <span className={styles.meterIcon}><FiTruck aria-hidden='true' /></span>
            <div><p>{freeShipping?<>Nice — you've unlocked <strong>free shipping</strong>.</>:<>You're <strong>{formatUSD(remaining||0.01)}</strong> away from free shipping.</>}</p>
              <div className={styles.meterTrack} role='progressbar' aria-label='Progress toward free shipping' aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><span style={{width:`${progress}%`}} /></div></div>
          </div>
          <div className={styles.bagHeading}><h2>The pieces you picked</h2><span>{count} {count===1?'item':'items'}</span></div>
          <ul className={styles.cartItems}>
            {cart.cartItems.map(item=>{
              const stock=item.variants.find(variant=>variant.size===item.size)?.stock||0;
              return <li className={styles.cartItem} key={`${item._id}-${item.size}`}>
                <Link to={`/product/${item._id}`} className={styles.cartImage}><img src={productImageUrl(item.image)} alt={item.name} /></Link>
                <div className={styles.productInfo}>{item.subCategory&&<p className={styles.productType}>{item.subCategory}</p>}<Link to={`/product/${item._id}`} className={styles.productName}>{item.name}</Link>
                  <div className={styles.meta}><span className={styles.chip}><small>Size</small>{item.size||'Standard'}</span><span>{formatUSD(item.price)} each</span>{stock>0&&stock<=3&&<span className={styles.lowStock}>Only {stock} left</span>}</div>
                  <div className={styles.stepper}><QuantityCounter value={item.qty} setValue={qty=>dispatch(addToCart({...item,qty}))} max={stock} /></div></div>
                <div className={styles.itemActions}><strong>{formatUSD(item.price*item.qty)}</strong><button type='button' aria-label={`Remove ${item.name} (${item.size})`} onClick={()=>dispatch(removeFromCart({id:item._id,size:item.size}))}><FiTrash2 /> Remove</button></div>
              </li>;
            })}
          </ul>
          <div className={styles.bagFootnote}><FiShoppingBag /><span>Found something else you love? Your bag will be here.</span></div>
        </section>
        <OrderSummary cart={cart}><button type='button' className={styles.cta} onClick={()=>navigate(user?'/shipping':'/login?redirect=/shipping')}>Continue to checkout <FiArrowRight /></button><p className={styles.paymentHint}>You won't pay anything until your order arrives.</p></OrderSummary>
      </div>
    </>:<section className={styles.empty}><span><FiShoppingBag /></span><p className='eyebrow'>ROOM FOR SOMETHING GOOD</p><h2>Your bag is waiting.</h2><p>Explore the collections and find your next everyday favorite.</p><Link to='/' className='btn btn-dark'>Explore the store <FiArrowRight /></Link></section>}
  </Container>;
}
