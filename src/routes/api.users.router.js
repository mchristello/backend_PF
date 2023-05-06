import { Router } from 'express';
import { loginApiPost, modifyRol, registerApiPost, uploadDocs } from '../controllers/users.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import CustomError from '../repository/errors/custom.error.js';
import ERRORS from '../repository/errors/enums.js';
import { generateGeneralError } from '../repository/errors/info.js';
import { UsersService } from '../repository/index.js';
import { authPolicies } from '../utils/utils.js';
import upload from '../utils/multer.js';
import passport from 'passport';


const router = Router();


router.get('/', authPolicies('admin'), async (req, res) => {
    try {
        const users = await UsersService.getUsers();

        const dataToShow = []
        users.forEach(u => {
            const user = {
                id: u._id,
                first_name: u.first_name,
                last_name: u.last_name,
                email: u.email,
                rol: u.rol,
                social: u.social,
                cart: u.cart,
                last_connection: u.last_connection
            }
            dataToShow.push(user)
        });
        
        return res.status(200).send({ status: 'succes', payload: dataToShow })
    } catch (error) {
        CustomError.createError({
            name: `User search error`,
            cause: generateGeneralError(error),
            message: `Problema en ApiUsers, endpoint: ${req.url}.`,
            code: ERRORS.GENERAL_ERROR
        })
        return res.status(500).send({ status: 'error', error: error.message })
    }
})

router.get('/current', AuthMiddleware.currentUser ,async (req, res) => {
    const user = req.session.user;

    if(!user) {
        return res.status(401).send({ status: 'error', error: 'User not logged in' });
    }
    const getUser = await UsersService.getUser(user.email)
    
    return res.send({ status: 'success', payload: getUser})
})

router.get("/premium/:uid", modifyRol);

router.post('/:uid/documents', upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'products', maxCount: 1 },
    { name: 'documents', maxCount: 1 },
]), uploadDocs);

// TODO: Terminar con la eliminación de usuarios inactivos
router.get('/deleteIncativeUsers', authPolicies('admin'), async(req, res) => {
    const session = req.session.user;
    if(!session) return res.status(400).send({ status: 'error', error: 'No user logged in' })
    
    const user = await UsersService.getById(session._id)
    console.log(user);
    
    const fecha1 = new Date(user.last_connection).toLocaleString();
    const fecha2 = new Date().toLocaleString();
    
    console.log(fecha1);
    console.log(fecha2);
    
    return res.status(200).send({ status: 'success', payload: user })
})

// Router for Testing Register & Login
router.post('/register', passport.authenticate('register', { failureRedirect: '/users/error' }), registerApiPost);

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/error' }), loginApiPost)

export default router;