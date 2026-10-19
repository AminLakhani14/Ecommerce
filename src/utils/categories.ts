// Older product responses and saved carts can still contain a single category.
export const productCategories = (category: string | string[]): string[] =>
  Array.isArray(category) ? category : category ? [category] : [];
