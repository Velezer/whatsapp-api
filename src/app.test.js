/* eslint-disable no-undef */
const request = require("supertest")


// const jest = require("jest")
// const UserModel = jest.fn()
// const ContactsModel = jest.fn()


const app = require('./app')(db, bcrypt)




describe('handler user /api/user', () => {
    it('POST / --> 201 user created', () => {
        request(app).post('/api/user')
            .expect('Content-Type', /json/)
            .expect(201)
    })
})
