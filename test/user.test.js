import chai from 'chai';
import supertest from 'supertest';
import config from '../src/config/config.js';
import { generateOneUser } from '../src/utils/faker.js';

const expect = chai.expect;
// const requester = supertest(config.URL);
const requester = supertest('http://localhost:8080');


describe('User register and login', () => {

    describe('POST /resgister', () => {
        it("Should return 401 if the user already exists.", async () => {

            const realUser = {
                first_name: 'Matias',
                last_name: 'Christello',
                email: 'm.christello@hotmail.com',
                password: 'contraseña'
            }
            const response = await requester.post('/users/register').send(realUser);
            const { status } = response
            console.log(status);

            expect(status).to.be.equal(401)
        });

        // it('Should resgister a new user.', async () => {
        //     const fakeUser = generateOneUser()
        //     console.log(fakeUser);

        //     const {response} = await requester.post("/users/register").send(fakeUser);

        //     expect(response).to.exist.and.to.be.equal(200);
        // })

    })

    describe('POST /login', () => {
        it('POST /login',  async () => {
            const realUser = {
                email: 'm.christello@hotmail.com',
                password: 'contraseña'
            }

            const response = await requester.post('/users/login').send({username: realUser.email, password: realUser.password})

            const { status, ok, _body } = response

                console.log(status);
                console.log(ok);
                console.log(_body);

            expect(status).to.exist.and.to.be.equal(200)
        })
    })

    describe('GET /api/users', () => {
        before(async() => {
            const login = requester.post('/users/login').send({ email: 'm.christello@hotmail.com', password: 'contraseña' })
        })
        it(`GET /api/users/current`, async () => {
            const response = await requester.get('/api/users/current')

            const { status } = response

            expect(status).to.be.eql(200);
        })
    })
})