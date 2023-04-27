import nodemailer from 'nodemailer';
import config from '../config/config.js'

export default class Mail {
    constructor() {
        this.transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: config.TRANSPORT_USER,
                pass: config.TRANSPORT_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    send = async (user, subject, html) => {
        console.log(`From nodemailer: `, user);
        const result = await this.transport.sendMail({
            from: config.TRANSPORT_USER,
            to: user.user,
            subject: user.subject,
            html: user.html
        })

        console.log(`result from Nodemailer: `, result);

        return result
    }
}

export const sendMail = new Mail();