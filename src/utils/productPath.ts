/** Storefront URL for a product: its name slug, or its ID for products saved before slugs existed. */
export const productPath = (product: { _id: string; slug?: string }) => `/product/${product.slug || product._id}`;
