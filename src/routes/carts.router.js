import { Router } from 'express';
import { addProduct, createCart, deleteProduct, emptyCart, getCartById, getCarts, purchase } from '../controllers/carts.controller.js';
import { authPolicies } from '../utils/utils.js';

const router = Router();


router.get('/', getCarts)
router.post('/', createCart)
router.get('/:cid', getCartById)
router.delete('/:cid', emptyCart)
router.post('/:cid/products/:pid', addProduct)
router.delete('/:cid/products/:pid', deleteProduct)
router.post('/:cid/purchase', purchase)



export default router;