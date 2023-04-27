import { Router } from 'express';
import { purchase } from '../controllers/carts.controller.js';
import { addNewProdGet, addNewProdPost, cartById, getProducts, home, productDetails, userAccount } from '../controllers/views.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';


const router = Router();

// GET to homepage
router.get('/home', home)

// GET w/paginate & query params
router.get('/products', getProducts);

// GET to add new product
router.get('/products/addNew', AuthMiddleware.isAuthenticated, addNewProdGet);

// POST to add new product
router.post('/products/addNew', AuthMiddleware.isAuthenticated, addNewProdPost);

// GET to product detail 
router.get('/products/:pid', productDetails);

// GET to Carts
router.get('/carts/:cid', AuthMiddleware.isAuthenticated, cartById);

// User Profile
router.get('/users/current', AuthMiddleware.isAuthenticated, userAccount)

// Purchase de compra
router.post('/carts/:cid/purchase', AuthMiddleware.isAuthenticated, purchase)

export default router
