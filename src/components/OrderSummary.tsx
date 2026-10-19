import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiMapPin, FiShoppingBag, FiTruck } from 'react-icons/fi';
import type { CartState } from '../types';
import { formatUSD } from '../utils/currency';
import { FREE_SHIPPING_THRESHOLD } from '../utils/cartUtils';
import { productImageUrl } from '../utils/productImage';
import styles from '../pages/styles/Commerce.module.css';
export default function OrderSummary({cart,showProducts=false,children}:{cart:CartState;showProducts?:boolean;children?:ReactNode}) {
  const count=cart.cartItems.reduce((total,item)=>total+item.qty,0);
  return <aside className={styles.summary} aria-label='Order summary'>
    <div className={styles.summaryHeading}><span className={styles.summaryIcon}><FiShoppingBag /></span><div><p>THE GOOD STUFF</p><h2>Order summary</h2></div><span className={styles.itemCount}>{count} {count===1?'item':'items'}</span></div>
    {showProducts&&<ul className={styles.summaryProducts}>{cart.cartItems.map(item=><li className={styles.summaryProduct} key={`${item._id}-${item.size}`}><div className={styles.summaryImage}><img src={productImageUrl(item.image)} alt='' /><span>{item.qty}</span></div><div><Link to={`/product/${item._id}`}>{item.name}</Link><small>{item.size} &middot; Qty {item.qty}</small></div><strong>{formatUSD(item.price*item.qty)}</strong></li>)}</ul>}
    <div className={styles.totals}><div><span>Subtotal <small>({count} {count===1?'item':'items'})</small></span><strong>{formatUSD(cart.itemsPrice)}</strong></div><div><span>Shipping</span><strong>{Number(cart.shippingPrice)===0?<span className={styles.freeShipping}>Free</span>:formatUSD(cart.shippingPrice)}</strong></div>{cart.taxPrice>0&&<div><span>Tax</span><strong>{formatUSD(cart.taxPrice)}</strong></div>}</div>
    <div className={styles.total}><div>Total<small>All prices in USD</small></div><strong>{formatUSD(cart.totalPrice)}</strong></div>
    {children}
    <ul className={styles.perks}><li><FiDollarSign aria-hidden='true' />Pay cash on delivery</li><li><FiTruck aria-hidden='true' />Free shipping over {formatUSD(FREE_SHIPPING_THRESHOLD)}</li><li><FiMapPin aria-hidden='true' />Delivering across the United States</li></ul>
  </aside>;
}
