import type { Product } from '../types';

type Priced = Pick<Product, 'price' | 'isOnSale' | 'salePrice'> & { originalPrice?: number };

/** Regular price, the price actually charged, and the discount when a sale applies. */
export function getPricing(product: Priced) {
  const original = product.originalPrice ?? product.price;
  const onSale = product.isOnSale && product.salePrice != null && product.salePrice < original;
  const current = onSale ? product.salePrice! : original;
  return { original, current, onSale, percentOff: onSale ? Math.round((1 - current / original) * 100) : 0 };
}
