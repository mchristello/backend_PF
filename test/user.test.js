import chai from 'chai';
import supertest from 'supertest';
import config from '../src/config/config.js';
import { generateOneUser } from '../src/utils/faker.js';

const expect = chai.expect;
// const requester = supertest(config.URL);
const requester = supertest('http://localhost:8080');


describe('User register and login', () => {

    // describe('POST /resgister', () => {
    //     it("Should return 401 if the user already exists.", async () => {

    //         const realUser = {
    //             first_name: 'Matias',
    //             last_name: 'Christello',
    //             email: 'm.christello@hotmail.com',
    //             password: 'contraseña'
    //         }
    //         const {status} = await requester.post('/api/users/register').send(realUser);
    //         console.log(status);

    //         expect(status).to.be.equal(401)
    //     });

        // it('Should resgister a new user.', async () => {
        //     const fakeUser = generateOneUser()
        //     console.log(fakeUser);

        //     const {response} = await requester.post("/api/users/register").send(fakeUser);

        //     expect(response).to.exist.and.to.be.equal(200);
        // })

    // })

    describe('POST /login', () => {
        it('POST /login',  async () => {
            const realUser = {
                email: 'm.christello@hotmail.com',
                password: 'contraseña'
            }

            const response = await requester.post('/api/users/login').send(realUser)

            const { status, ok } = response

            expect(status).to.exist.and.to.be.equal(200)
            expect(ok).to.exist.and.to.be.eql(true)
        })
    })

    describe('GET /api/users', () => {
        let cookie;

        const mockUser = generateOneUser()

        const realUser = {
            email: 'm.christello@hotmail.com',
            password: 'contraseña'
        }

        beforeEach(async() => {
            const login = await requester.post('/api/users/login').send(realUser)
        })

        it(`GET /api/users/current`, async () => {
            const response = await requester.get('/api/users/current')

            const { status, _body } = response
            console.log(status);
            console.log(`FROM GET API/USERS/CURRENT: `, _body);

            expect(status).to.be.eql(200);
        })

        // it('Debe registrar un usario', async () => {
        //     const { _body } = await requester.post('/api/users/register').send(mockUser)

        //     expect(_body.payload).to.be.ok
        // })

        it('Debe loguear un user y DEVOLVER UNA COOKIE', async () => {
            const result = await requester.post('/api/users/login').send(realUser)

            //COOKIE_NAME=COOKIE_VALUE
            const cookieResult = result.headers['set-cookie'][0]
            // console.log(`THIS IS COOKIERESULT: `, cookieResult);

            expect(cookieResult).to.be.ok 
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }

            console.log(`COOKIE VALUES: `, cookie);

            expect(cookie.name).to.be.ok.and.eql('coderCookieToken')
            expect(cookie.value).to.be.ok

        })

        it('enviar cookie para ver el contenido del usuario', async () => {
            const {status, _body} = await requester.get('/api/users/current').set('Cookie', [`${cookie.name}=${cookie.value}`])

            console.log(`THIS IS _BODY FROM COOKIE INFO:`, _body);
            console.log(`THIS IS status FROM COOKIE INFO:`, status);
            
            expect(_body.payload.email).to.be.eql(realUser.email)
        })
    })


})