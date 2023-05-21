import dotenv from 'dotenv';

dotenv.config();

export default {
    PORT: process.env.PORT,
    ENT: process.env.ENT,
    BASE_URL: process.env.BASE_URL,
    TRANSPORT_USER: process.env.TRANSPORT_USER,
    TRANSPORT_PASS: process.env.TRANSPORT_PASS,
    GOOGLE_TRANSPORT_PASS: process.env.GOOGLE_TRANSPORT_PASS,
    PERSISTENCE: process.env.PERSISTENCE,
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    STRIPE_KEY: process.env.STRIPE_KEY,
    JWT_PASS_TOKEN: process.env.JWT_PASS_TOKEN,
    COOKIE_NAME: process.env.COOKIE_NAME,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACKURL: process.env.GITHUB_CALLBACKURL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACKURL: process.env.GOOGLE_CALLBACKURL,
    MP_PUBLIC_KEY: process.env.MP_PUBLIC_KEY,
    MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN
}