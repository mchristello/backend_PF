import nodemailer from 'nodemailer';
import config from '../config/config.js'

export default class Mail {
    constructor() {
        this.transport = nodemailer.createTransport({
            service: 'hotmail',
            port: 587,
            host: 'smtp-mail.outlook.com',
            auth: {
                user: config.TRANSPORT_USER,
                pass: config.TRANSPORT_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    send = async (options) => {
        const result = await this.transport.sendMail({
            from: config.TRANSPORT_USER,
            to: options.user,
            subject: options.subject,
            html: options.html
        })

        return result
    }
}

export const sendMail = new Mail();