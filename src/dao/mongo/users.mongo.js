import config from '../../config/config.js';
import bcrypt from 'bcryptjs';
import CustomError from '../../repository/errors/custom.error.js';
import ERRORS from '../../repository/errors/enums.js';
import { generateGeneralError, generateNotFoundError } from '../../repository/errors/info.js';
import { sendMail } from '../../utils/nodemailer.js';
import { createHash, generateResetPasswordToken, validatePassword } from '../../utils/utils.js';
import UserModel from './models/users.model.js';


export default class Users {

    getUsers = async() => {
        try {
            const users = await UserModel.find().lean().exec();
            return users;
        } catch (error) {
            req.logger.error(`Error in UserService.`)
        }
    }

    getUser = async(data) => {
        try {
            const userSearched = await UserModel.findOne({ email: data });
            return userSearched;
        } catch (error) {
            req.logger.error(`Error in getUser on UserService.`)
        }
    }

    getById = async(uid) => {
        try {
            const userSearched = await UserModel.findOne({ _id: uid });
            return userSearched;
        } catch (error) {
            req.logger.error(`Error in getById on UserService.`)
        }
    }

    createUser = async(data) => {
        try {
            const newUser = await UserModel.create(data)
            req.logger.debug(`NEWUSER FROM USERS.MONGO: `, newUser);
            return newUser;
        } catch (error) {
            req.logger.error(error.message);
        }
    }

    // TODO: Revisar si se actualiza el usuario en Mongo.
    updateUser = async(userEmail, cartId) => {
        try {
            const findUser = await UserModel.findOne({ email: userEmail });
            
            if(findUser === undefined) {
                CustomError.createError({
                    name: `Cart search error`,
                    cause: generateNotFoundError(cid),
                    message: `Problema tratando de encontrar el usuario ${userEmail}`,
                    code: ERRORS.NOT_FOUND_ERROR
                })
            }
            
            const updateUser = await UserModel.updateOne({ _id: findUser._id }, cartId );
    
            return updateUser;
            // const user = await UserModel.findOne({ email: userEmail })
    
            // user.carts.push({ cart: cartId });
            
            // const result = await UserModel.updateOne({ email: userEmail }, user);
            
            // return result;
        } catch (error) {
            req.logger.error(`Error in getUser on UserService.`)
        }
    }

    modifyRol = async(uid) => {
        const user = await UserModel.findOne({_id: uid});
        if(user === undefined) {
            CustomError.createError({
                name: 'Error in modifyRol, User.Mongo',
                cause: generateNotFoundError(uid),
                message: 'User not found',
                code: ERRORS.NOT_FOUND_ERROR
            })
        }

        const newRol = await UserModel.updateOne({ _id: uid }, { rol: user.rol === 'user' ? 'premium' : 'user' })

        return newRol
    }

    sendResetMail = async(userEmail) => {
        const user = await this.getUser(userEmail)
        if(user === undefined) {
            CustomError.createError({
                name: 'Error in sendMail from MONGO file',
                cause: generateNotFoundError(userEmail),
                message: 'The email does not match any user in our DB',
                code: ERRORS.NOT_FOUND_ERROR
            })
        }

        const resetToken = generateResetPasswordToken(user)

        const resetLink = `${config.URL}/users/resetLink/${user._id}/${resetToken}`

        const mailOptions = {
            user: `${user.email}`,
            subject: `Reset your account password.`,
            html:   `<main class="container m-3">
                        <h2>Clik the link below to reset your password</h2>
                        <br>
                        <a href='${resetLink}'>Click here.</a>
                        <p class="mute">The is valid for 60 minutes.</p>
                    </main>`
        }

        await sendMail.send(mailOptions)

        return true
    }

    resetPassword = async(uid, token, password) => {
        const user = await this.getById(uid);

        if(!user) {
            CustomError.createError({
                name: 'Error in resetPassword, User.Mongo',
                cause: generateNotFoundError(uid),
                message: 'User not found',
                code: ERRORS.NOT_FOUND_ERROR
            })
            return false;
        };
        if(token === undefined) {
            CustomError.createError({
                name: 'Error in resetPassword, User.Mongo',
                cause: generateGeneralError(),
                message: 'The TOKEN has expired.',
                code: ERRORS.GENERAL_ERROR
            })
            return false;
        }

        const checkingPass = bcrypt.compare(password.password, user.password, function(err, result) {
            if(err) {
                console.log(`Error en bcrypt.compare`);
                return false;
            } else {
                console.log(`Bcrypt.compare OK`);
                return true;
            }
        });
        if (checkingPass) {
            CustomError.createError({
                name: 'Error in resetPassword, User.Mongo',
                cause: generateGeneralError(),
                message: `The new password must be different from the last one.`,
                code: ERRORS.GENERAL_ERROR
            })
            return console.log(`Error en checkingPass`);;
        }

        const hashedPassword = createHash(password.password)

        const result = await UserModel.updateOne({ _id: uid }, { password: hashedPassword });
    
        if (!result) {
            return false;
        }

        return true;
    }

    updateLastConnection = async(uid) => {
        const user = await UserModel.findOne({ _id: uid });
        const lastConnection = new Date().toLocaleString()

        user.last_connection = lastConnection;
        user.save();

        return true
    }
}