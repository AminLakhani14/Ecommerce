import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  image: { type: String, required: true }, // Main image (first from upload)
  gallery: [{ type: String }], // Array of other image paths
  description: { type: String, required: true }, // <-- ADDED
  category: { type: String, required: true, enum: ['Men', 'Women', 'Children', 'Sale'] },
  subCategory: { type: String, required: true }, // <-- ADDED
  price: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
  isOnSale: { type: Boolean, required: true, default: false },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;