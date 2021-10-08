/* eslint-disable no-undef */
const request = require("supertest")
const bcrypt = require("bcrypt")
const db = require("../model/db")
const ManagerWaweb = require('../waweb/manager')
const manager = new ManagerWaweb()
jest.mock('../waweb/manager')


jest.setTimeout(20000)

const createApp = require("../app")

const app = createApp(db, bcrypt, manager)

beforeAll((done) => {
    db.dbConnect()
        .once('open', () => done())
        .on('error', (err) => done(err))
})

beforeAll(async () => {
    await db.UserModel.deleteMany({})
    await db.ContactsModel.deleteMany({})
})

afterAll((done) => {
    db.dbClose()
        .then(() => done())
        .catch((err) => done(err))
})

describe('handler user /api/user', () => {
    const userData = {
        user: 'user',
        password: 'password',
        number: '628173190130'
    }
    const inputData = {
        ...userData,
        c_name: 'cname',
        c_number: '628339738912'
    }

    it('POST / --> 201 user created', async () => {
        await request(app).post('/api/user')
            .send(userData)
            .expect('Content-Type', /json/)
            .expect(201)
    })


    it('PUT /contacts --> 200 add contact', async () => {
        await request(app).put('/api/user/contacts')
            .send(inputData)
            .expect('Content-Type', /json/)
            .expect(200, {
                message: `successfully added contact ${inputData.c_name} ${inputData.c_number}`,
            })
    })

    it('DELETE /contacts --> 200 delete contact', async () => {
        await request(app).delete('/api/user/contacts')
            .send(inputData)
            .expect('Content-Type', /json/)
            .expect(200)
    })
})

