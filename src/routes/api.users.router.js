import { Router } from 'express';
import { deleteInactiveUsers, getAllUsers, getCurrentUser, loginApiPost, modifyRol, registerApiPost, uploadDocs } from '../controllers/users.controller.js';
import { authPolicies, authToken } from '../utils/utils.js';
import upload from '../utils/multer.js';
import passport from 'passport';


const router = Router();


router.get('/', getAllUsers)

router.get('/current', authToken, getCurrentUser)

router.get("/premium/:uid", modifyRol);

router.post('/:uid/documents', upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'products', maxCount: 1 },
    { name: 'documents', maxCount: 1 },
]), uploadDocs);

router.get('/deleteInactiveUsers', authPolicies('admin'), deleteInactiveUsers)

// Router for Testing Register & Login
router.post('/register', passport.authenticate('register', { failureRedirect: '/users/error' }), registerApiPost);

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/error' }), loginApiPost)

router.delete('/:uid', authPolicies('admin'), deleteUser)

export default router;