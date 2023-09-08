import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';
import asyncHandler from '../middleware/asyncHandler.js';

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);
router.get('/top', getTopProducts);
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

//router.get('/', asyncHandler(async(req, res) => {
//  const products = await Product.find({});
//  res.json(products);
//}));

//router.get('/:id', asyncHandler(async(req, res) => {
//  const product = await Product.findById(req.params.id);
//  res.json(product);
//}));

export default router;
