/* eslint-disable no-undef */
const request = require("supertest")

const UserModel = require('./model/user')
jest.mock('./model/user') // this happens automatically with automocking

const ContactsModel = require('./model/contacts')
jest.mock('./model/user') // this happens automatically with automocking

const bcrypt = require('bcrypt')
jest.mock('bcrypt') // this happens automatically with automocking


const db = {
    UserModel,
    ContactsModel
}


const createApp = require("./app")

const app = createApp(db, bcrypt)


describe('handler /', () => {
    it('GET / --> 200 server up', async () => {
        await request(app).get('/')
            .expect('Content-Type', /json/)
            .expect(200)
    })
})

describe('handler user /api/user', () => {
    it('POST / --> 400 no data', async () => {
        await request(app).post('/api/user')
            .expect('Content-Type', /json/)
            .expect(400)
    })
    it('POST / --> 201 happy', async () => {
        const data = {
            user: 'user',
            password: 'password',
            number: '628173190130'
        }
        UserModel.findOne.mockResolvedValue(null)
        bcrypt.hash.mockResolvedValue('hashed')
        UserModel.createUser.mockResolvedValue(data)

        await request(app).post('/api/user')
            .send(data)
            .expect('Content-Type', /json/)
            .expect(201, {
                message: `successfully created user`,
                data: {
                    user: data.user,
                    number: data.number
                }
            })
    })
})
