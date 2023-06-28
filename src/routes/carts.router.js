import { Router } from 'express';
import { addProduct, createCart, deleteProduct, emptyCart, getCartById, getCarts, purchase } from '../controllers/carts.controller.js';
import { authPolicies, authToken } from '../utils/utils.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';

const router = Router();


router.get('/', getCarts)
router.post('/', authPolicies('admin'), createCart)
router.get('/:cid', authToken, getCartById)
router.delete('/:cid', authToken, emptyCart)
router.post('/:cid/products/:pid', authToken, AuthMiddleware.currentUser, addProduct)
router.delete('/:cid/products/:pid', authToken, deleteProduct)
router.post('/:cid/purchase', AuthMiddleware.currentUser, purchase)



export default router;