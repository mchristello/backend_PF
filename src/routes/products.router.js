import { Router } from 'express';
import { get, add, deleteOne, find, update } from '../controllers/products.controller.js';
import { authPolicies } from '../utils/utils.js';

const router = Router();

router.get('/', get)
router.post('/', authPolicies('admin'), add)
router.get('/:pid', find)
router.post('/:pid', authPolicies('admin'), update)
router.delete('/:pid', authPolicies('admin'), deleteOne)

export default router;