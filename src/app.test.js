/* eslint-disable no-undef */
const request = require("supertest")


const jest = require("jest")

const db = {
    UserModel: jest.fn(),
    ContatctsModel: jest.fn()
}

const createApp = require("./app")

const app = createApp(db, bcrypt)



describe('handler user /api/user', () => {
    it('POST / --> 201 user created', () => {
        request(app).post('/api/user')
            .expect('Content-Type', /json/)
            .expect(201)
    })
})
