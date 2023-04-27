import { Router } from 'express';
import { modifyRol } from '../controllers/users.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import CustomError from '../repository/errors/custom.error.js';
import ERRORS from '../repository/errors/enums.js';
import { generateGeneralError } from '../repository/errors/info.js';
import { UsersService } from '../repository/index.js';
import { authPolicies } from '../utils/utils.js';


const router = Router();

router.get('/current', AuthMiddleware.currentUser ,async (req, res) => {
    const user = req.session.user;
    const getUser = await UsersService.getUser(user.email)

    if(!user) {
        return res.status(401).send({ status: 'error', error: 'User not logged in' });
    }

    return res.send({ status: 'success', payload: getUser})
})

router.get('/', authPolicies('admin'), async (req, res) => {
    try {
        const users = await UsersService.getUsers();

        const dataToShow = []
        users.forEach(u => {
            const user = {
                id: u._id,
                first_name: u.first_name,
                last_name: u.last_name,
                rol: u.rol,
                social: u.social,
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

router.get("/premium/:uid", modifyRol);

router.post('api/users/:uid/documents', async(req, res) => {
    try {
        
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


export default router;