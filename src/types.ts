export interface Variant { size: string; stock: number }
export interface Product {
  _id: string; name: string; image: string; gallery: string[]; description: string;
  category: string | string[]; subCategory: string; price: number; countInStock: number;
  isOnSale: boolean; isActive: boolean; variants: Variant[];
}
export interface UserInfo { _id: string; name: string; email: string; isAdmin: boolean; token?: string }
export type ProductSummary = Omit<Product, 'description' | 'gallery'>;
export interface ShippingAddress {
  email: string; firstName: string; lastName: string; address: string; city: string;
  state: string; postalCode: string; country: string; phone: string;
}
export interface CartItem extends Product { qty: number; size: string }
export interface CartState {
  cartItems: CartItem[]; shippingAddress: Partial<ShippingAddress>;
  itemsPrice: number; shippingPrice: number; taxPrice: number; totalPrice: string;
}
export interface OrderInput {
  orderItems: CartItem[]; shippingAddress: ShippingAddress; paymentMethod: string;
  itemsPrice: number; shippingPrice: number; taxPrice: number; totalPrice: number | string;
}
export interface Order extends Omit<OrderInput, 'orderItems' | 'totalPrice'> {
  _id: string; user: UserInfo | null; totalPrice: number;
  orderItems: Array<Pick<CartItem, 'name' | 'qty' | 'size' | 'price' | 'image'> & { product: string }>;
  isPaid: boolean; paidAt?: string; isDelivered: boolean; deliveredAt?: string;
  isCancelled: boolean; createdAt: string;
}
export interface ApiError { status?: string | number; data?: { message?: string }; error?: string; message?: string }
export interface MenuData {
  columns: Array<{ title: string; links: string[] }>;
  featured: Array<{ title: string; imageSrc: string; link: string }>;
}
