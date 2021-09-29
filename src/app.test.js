/* eslint-disable no-undef */
const request = require("supertest")

const UserModel = require('./model/user');
jest.mock('./model/user'); // this happens automatically with automocking

const ContactsModel = require('./model/contacts');
jest.mock('./model/user'); // this happens automatically with automocking

const bcrypt = require('bcrypt');
jest.mock('bcrypt'); // this happens automatically with automocking

const db = {
    UserModel,
    ContactsModel
}


const createApp = require("./app")

const app = createApp(db, bcrypt)


describe('handler /', () => {
    test('GET / --> 200', async () => {
        await request(app).get('/')
            .expect('Content-Type', /json/)
            .expect(200)
    })
})
// describe('handler user /api/user', () => {
//     test('POST / --> 201 user created', () => {
//         // request(app).post\
//         request(app).post('/api/user')
//             .send({})
//             .expect('Content-Type', /json/)
//             .expect(200)
//     })
// })
