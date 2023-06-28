import { Router } from 'express';
import { get, add, deleteOne, find, update, getAll } from '../controllers/products.controller.js';
import { authPolicies } from '../utils/utils.js';

const router = Router();

router.get('/', get)
router.get('/allProducts', getAll)
router.post('/', authPolicies('admin', 'premium'), add)
router.get('/:pid', find)
router.post('/:pid', authPolicies('admin'), update)
router.delete('/:pid', authPolicies('admin', 'premium'), deleteOne)

export default router;