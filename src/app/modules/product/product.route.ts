import { Router } from 'express';
import { ProductController } from './product.controller';

const router = Router();


router
  .route('/')
  .post(ProductController.create)
  .get(ProductController.findMany);

router
  .route('/:productId')
  .get(ProductController.findById)
  .patch(ProductController.update)
  .delete(ProductController.remove);

export const ProductRoutes = router;
