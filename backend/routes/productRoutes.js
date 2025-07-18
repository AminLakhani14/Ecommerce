import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct, // <-- IMPORT
  deleteProduct, // <-- IMPORT
  getHomepageProducts,
  getProductsByCategory, 
  getSaleProducts, // <-- IMPORT
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

router.route('/')
  .get(getProducts)
  .post(protect, admin, upload.array('gallery', 6), createProduct)
  .delete(protect, admin, deleteProduct); 

router.get('/category/:categoryName', getProductsByCategory);
router.get('/homepage', getHomepageProducts);
router.get('/sale', getSaleProducts); //
router.route('/:id').get(getProductById);

export default router;