import { Router } from 'express';
import { addProduct, createCart, deleteProduct, emptyCart, getCartById, getCarts } from '../controllers/carts.controller.js';

const router = Router();


router.get('/', getCarts)
router.post('/', createCart)
router.get('/:cid', getCartById)
router.delete('/:cid', emptyCart)
router.post('/:cid/products/:pid', addProduct)
router.delete('/:cid/products/:pid', deleteProduct)
// router.get('/:cid/purchase', purchase)



export default router;