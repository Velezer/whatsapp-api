/* eslint-disable no-undef */
const request = require("supertest")
const app = require('../app')


describe('handler user /api/user', () => {
    it('POST / --> 201 user created', () => {
        request(app).post('/api/user')
            .expect('Content-Type', /json/)
            .expect(201)
    })
})
