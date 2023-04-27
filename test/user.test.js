import chai from 'chai';
import supertest from 'supertest';
import config from '../src/config/config.js';
import { generateOneUser } from '../src/utils/faker.js';

const expect = chai.expect;
const requester = supertest(config.URL);

describe('User register and login', () => {
    // let cookie;

    
    describe(`Register Test`, () => {

        it(`El endpoint /api/users debería traer un listado de todos los usuarios registrados en la app. Method: GET`, async () => {
            const response = await requester.get('/api/users')

            const { status, ok, body } = response

            expect(status).to.be.eql(200);
        })

        // it('El endpoint /users/register debe registrar un usuario nuevo, method: POST', async () => {
        //     const fakeUser = generateOneUser()
        //     console.log(fakeUser);

        //     const {response} = await requester.post("/users/register").send(fakeUser);
    
        //     console.log(response.status);
        //     console.log(response.ok);
        //     console.log(response._body);

        //     // expect(response).to.exist.and.to.be.equal(200);
        // })
        
        it("El endpoint /users/register debe retornar status 401 si el usuario ya se encuentra en la base de datos. Method: POST", async () => {

            const realUser = {
                first_name: 'Matias',
                last_name: 'Christello',
                email: 'm.christello@hotmail.com',
            }
            const response = await requester.post('/users/register').send(realUser);
            const { status } = response
            console.log(status);

            expect(status).to.exist.and.to.be.equal(401)
        });
    })

    describe('Login Test', () => {
        it('El endpoint /users/login debe iniciar sesión si el user está registrado en la base de datos y devolver status 200. Method: POST',  async () => {
            const realUser = {
                email: 'm.christello@hotmail.com',
                password: 'secret'
            }

            const response = await requester.post('/users/login').send(realUser)

            const { status, ok, _body } = response

                console.log(status);
                console.log(ok);
                console.log(_body);

            expect(status).to.exist.and.to.be.equal(200)
        })
    })
})