import config from '../config/config.js';
import CustomError from '../repository/errors/custom.error.js';
import ERRORS from '../repository/errors/enums.js';
import { generateGeneralError, generateNotFoundError } from '../repository/errors/info.js';
import { UsersService } from '../repository/index.js';


export const registerGet = async(req, res) => {
    try {
        return res.render(`users/register`, {
            style: 'style.css'
        })
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const registerPost = async(req, res) => {
    try {
        if(!req.user) {
            return res.status(400)
        }

        return res.status(200).redirect('/users/login');
    } catch (error) {
        req.logger.error(`From resgisterPost: ${error}`);
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const loginGet = async(req, res) => {
    try {
        return res.render('users/login', {
            style: 'style.css'
        })
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const loginPost = async(req, res) => {
    try {
        if (!req.user) {
            return res.status(400).render('errors/general', { 
                style:'style.css',
                error: `Invalid Credentials`
            })
        }

        req.session.user = {
            _id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            rol: req.user.rol,
            social: req.user.social,
            cart: req.user.cart,
            documents: req.user.documents,
            last_connection: req.user.last_connection
        }

        const updateUser = await UsersService.updateLastConnection(req.session.user._id)

        return res.cookie(config.COOKIE_NAME, req.user.token).redirect('/home');
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const loginGitHub = async (req, res) => {
    try {
        req.session.user = req.user;
        return res.status(200).redirect('/users/current');
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const loginGoogle = async (req, res) => {
    try {
        req.session.user = req.user;
        return res.status(200).redirect('/users/current');
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const loginApiPost = async (req, res) => {
    try {
        req.session.user = {
            _id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            rol: req.user.rol,
            social: req.user.social,
            cart: req.user.cart,
            documents: req.user.documents,
            last_connection: req.user.last_connection
        }

        return res.cookie(config.COOKIE_NAME, req.user.token).send({ status: 'success', message: 'Login API Success.'});
    } catch (error) {
        req.logger.error(`From loginApiPost: ${error.message}`);
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const registerApiPost = async (req, res) => {
    try {
        if(!req.user) {
            return res.status(400)
        }

        return res.status(200).send({ status: 'success', message: 'Register API Success.'});
    } catch (error) {
        req.logger.error(`From resgisterApiPost: ${error}`);
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        const updateUser = UsersService.updateLastConnection(req.session.user._id)
        req.session.destroy(err => {
            if (err) {
                return res.status(500).render('errors/general', { 
                    style: 'style.css',
                    error: err 
                });
            }

    
            return res.status(200).clearCookie(config.COOKIE_NAME).redirect('/home');
        });
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const errors = async (req, res) => {
    try {
        return res.status(500).render('errors/general', { 
            style: 'style.css',
            error: 'Session Error, try again later' 
        });
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const getReset = async (req, res) => {
    try {
        return res.status(200).render('users/resetPassword', {
            style: 'style.css'
        });
    } catch (error) {
        req.logger.error(error)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const postReset = async (req, res) => {
    try {
        const userEmail = req.body.email
        
        const sendMail = await UsersService.sendResetMail(userEmail)
        req.logger.debug(`sendMail from postReset --------> ${sendMail}`);

        const date = new Date();
        const currentDate = date.toLocaleString();
    
        return res.status(200).send({ status: 'success', message: `Mail sent at ${currentDate}. Check your inbox` })

    } catch (error) {
        req.logger.error(`Error un postReset: ${error}`)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const getResetLink = async(req, res) => {
    try {
        const uid = req.params.uid;
        const token = req.params.resetToken;
        // console.log(`DATA FROM getResetLink: `, uid, resetToken);

        const user = await UsersService.getById(uid);
        // console.log(`USER FROM getResetLink: `, user.email);

        if(user === undefined) {
            CustomError.createError({
                name: 'Error in Users.Controller',
                cause: generateNotFoundError(uid),
                message: `User no encontrado, endpoint: ${req.url}.`,
                code: ERRORS.NOT_FOUND_ERROR
            })
            return res.status(401).redirect('users/resetPassword')
        }

        return res.status(200).render('users/newPassword', {
            style: 'style.css',
            userEmail: user.email,
            uid,
            token
        })

    } catch (error) {
        // req.logger.error(`Error un getResetLink: ${error}`)
        return res.status(400).send({ status: 'error', error: error.message });
    }
}

export const postResetLink = async (req, res) => {
    try {
        const uid = req.params.uid;
        const token = req.params.token;
        if(token === undefined) {
            CustomError.createError({
                name: 'Error in postResetLink, User.Controller',
                cause: generateGeneralError(),
                message: 'The TOKEN has expired.',
                code: ERRORS.GENERAL_ERROR
            })
            res.redirect('users/login')
        }
        const password = req.body;

        const result = await UsersService.resetPassword(uid, token, password);

        return res.status(200).redirect("users/login");

    } catch (error) {
        console.log(error);
        return res.status(400).send({ status: 'error', error: error });
    }
}

export const modifyRol = async (req, res) => {
    try {
        const uid = req.params.uid

        const user = await UsersService.getById(uid)
        if(user.rol !== 'user' || user.rol !== 'premium') {
            return res.status(403).send({ status: 'error', message: 'No se puede actulizar el rol del usuario' });
        }

        const newRol = await UsersService.modifyRol(uid)
        const updatedUser = await UsersService.getById(uid)

        return res.status(200).send({ status: 'success', payload: updatedUser });

    } catch (error) {
        CustomError.createError({
            name: 'catch in modifyRol, User.Controller',
            cause: generateGeneralError(),
            message: `Problema en UserController, endpoint: ${req.url}.`,
            code: ERRORS.GENERAL_ERROR
        })
        return res.status(500).send({ status: 'error', error: error.message });
    }
}

// TODO: Completar funcionalidad para subir archivos.
export const uploadDocs = async (req, res) => {
    try {
        const { uid } = req.params

        const filesValues = Object.values(req.files)

        filesValues.map(async (files) => {
            return files.map(async (file) => {
                const newFiles = {
                name: file.originalname,
                reference: file.path,
                };
                // console.log(newFiles);
                await UsersService.uploadDocs(uid, newFiles);
    
                return;
            });
        });

        return res.status(200).send({ status: 'success', message: `File uploaded succesfully.` });
        
    } catch (error) {
        req.logger.error(error.message)
        return res.status(500).send({ status: 'error', error: error.message })
    }
}
