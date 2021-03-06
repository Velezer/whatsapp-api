/* eslint-disable no-undef */
const request = require("supertest")

const UserModel = require('../model/user')
jest.mock('../model/user')

const ContactsModel = require('../model/contacts')
jest.mock('../model/contacts')

const bcrypt = require('bcrypt')
jest.mock('bcrypt')

const ManagerWaweb = require('../waweb/manager')
const manager = new ManagerWaweb()
jest.mock('../waweb/manager')

const ClientWaweb = require('../waweb/client')
jest.mock('../waweb/client')

const db = {
    UserModel,
    ContactsModel
}


const createApp = require("../app")

const app = createApp(db, bcrypt, manager)


describe('handler /', () => {
    it('GET / --> 200 server up', async () => {
        await request(app).get('/')
            .expect('Content-Type', /json/)
            .expect(200)
    })
})

describe('handler user /api/user', () => {
    const userData = {
        user: 'user',
        password: 'password',
        number: '628173190130'
    }
    it('POST / --> 400 no data', async () => {
        await request(app).post('/api/user')
            .expect('Content-Type', /json/)
            .expect(400)
    })
    it('POST / --> 400 user exist', async () => {
        UserModel.findOne.mockResolvedValue(userData)
        await request(app).post('/api/user')
            .send(userData)
            .expect('Content-Type', /json/)
            .expect(400, {
                message: `user with number ${userData.number} is already exist`,
            })
    })
    it('POST / --> 201 user created', async () => {
        UserModel.findOne.mockResolvedValue(null)
        bcrypt.hash.mockResolvedValue('hashed')
        UserModel.createUser.mockResolvedValue(userData)

        await request(app).post('/api/user')
            .send(userData)
            .expect('Content-Type', /json/)
            .expect(201, {
                message: `successfully created user`,
                data: {
                    user: userData.user,
                    number: userData.number
                }
            })
    })
    it('POST / --> 500 create user fail', async () => {
        UserModel.findOne.mockResolvedValue(null)
        bcrypt.hash.mockResolvedValue('hashed')
        UserModel.createUser.mockRejectedValue(new Error('db error'))

        await request(app).post('/api/user')
            .send(userData)
            .expect('Content-Type', /json/)
            .expect(500)
    })
    it('DELETE / --> 200 user deleted', async () => {
        UserModel.findOne.mockResolvedValue(userData)
        UserModel.deleteOne.mockResolvedValue(true)
        bcrypt.compare.mockResolvedValue(true)

        await request(app).delete('/api/user')
            .send(userData)
            .expect('Content-Type', /json/)
            .expect(200, {
                message: `successfully deleted user`,
            })
    })
    it('DELETE / --> 400 password wrong', async () => {
        UserModel.findOne.mockResolvedValue(userData)
        UserModel.deleteOne.mockResolvedValue(true)
        bcrypt.compare.mockResolvedValue(false)

        await request(app).delete('/api/user')
            .send(userData)
            .expect('Content-Type', /json/)
            .expect(400)
    })
    it('DELETE / --> 404 user not found', async () => {
        UserModel.findOne.mockResolvedValue(null)

        await request(app).delete('/api/user')
            .send(userData)
            .expect('Content-Type', /json/)
            .expect(404)
    })

})


describe('handler user contacts /api/user', () => {
    const inputData = {
        user: 'user',
        password: 'password',
        number: '628173190130',
        c_name: 'cname',
        c_number: '628339738912'
    }
    const userData = {
        contacts: '921e092s1092s21' // _id
    }
    const contactData = {
        c_name: inputData.c_name,
        c_number: inputData.c_number,
    }

    it('PUT /contacts --> 200 add contact', async () => {
        UserModel.findOne.mockResolvedValue(userData)
        ContactsModel.pushContact.mockResolvedValue(contactData)
        bcrypt.compare.mockResolvedValue(true)
        await request(app).put('/api/user/contacts')
            .send(inputData)
            .expect('Content-Type', /json/)
            .expect(200)
    })
    it('PUT /contacts --> 400 password wrong', async () => {
        UserModel.findOne.mockResolvedValue(userData)
        ContactsModel.pushContact.mockResolvedValue(contactData)
        bcrypt.compare.mockResolvedValue(false)
        await request(app).put('/api/user/contacts')
            .send(inputData)
            .expect('Content-Type', /json/)
            .expect(400)
    })
    it('PUT /contacts --> 404 user not found', async () => {
        UserModel.findOne.mockResolvedValue(null)

        await request(app).put('/api/user/contacts')
            .send(inputData)
            .expect('Content-Type', /json/)
            .expect(404)
    })
    it('DELETE /contacts --> 200 delete contact', async () => {
        UserModel.findOne.mockResolvedValue(userData)
        ContactsModel.deleteContact.mockResolvedValue(contactData)
        bcrypt.compare.mockResolvedValue(true)

        await request(app).delete('/api/user/contacts')
            .send(inputData)
            .expect('Content-Type', /json/)
            .expect(200, {
                message: `successfully deleted contact ${inputData.c_name} ${inputData.c_number}`,
                data: contactData
            })
    })
    it('DELETE /contacts --> 400 password wrong', async () => {
        UserModel.findOne.mockResolvedValue(userData)
        ContactsModel.deleteContact.mockResolvedValue(contactData)
        bcrypt.compare.mockResolvedValue(false)

        await request(app).delete('/api/user/contacts')
            .send(inputData)
            .expect('Content-Type', /json/)
            .expect(400)
    })
    it('DELETE /contacts --> 404 user not found', async () => {
        UserModel.findOne.mockResolvedValue(null)
        await request(app).delete('/api/user/contacts')
            .send(inputData)
            .expect('Content-Type', /json/)
            .expect(404)
    })
    it('GET /contacts --> 200 get contact', async () => {
        userData.contacts = contactData
        UserModel.findOne.mockReturnThis()
        UserModel.populate.mockResolvedValue(userData)
        bcrypt.compare.mockResolvedValue(true)

        await request(app).get('/api/user/contacts')
            .send(inputData)
            .expect('Content-Type', /json/)
            .expect(200, {
                user: inputData.user,
                message: `success`,
                data: contactData
            })
    })
    it('GET /contacts --> 400 password wrong', async () => {
        userData.contacts = contactData
        UserModel.findOne.mockReturnThis()
        UserModel.populate.mockResolvedValue(userData)
        bcrypt.compare.mockResolvedValue(false)

        await request(app).get('/api/user/contacts')
            .send(inputData)
            .expect('Content-Type', /json/)
            .expect(400)
    })
    it('GET /contacts --> 404 user not found', async () => {
        userData.contacts = contactData
        UserModel.findOne.mockReturnThis()
        UserModel.populate.mockResolvedValue(null)

        await request(app).get('/api/user/contacts')
            .send(inputData)
            .expect('Content-Type', /json/)
            .expect(404)
    })
})

describe('handler waweb /api/waweb', () => {
    const userData = {
        _id: 'dj18dj1jdi0dw1',
        user: 'user',
        password: 'password',
        number: '628173190130'
    }

    const sendData = {
        message: 'mess',
        numbers: '628389723912'
    }

    const sendDataMedia = {
        caption: 'caption',
        numbers: '3891723912'
    }

    const client = new ClientWaweb(userData)
    client.getContacts = () => [{}, {}, {}] // mock

    it('POST /send-message --> 200 message sent', async () => {
        client.isReady = true
        UserModel.findOne.mockResolvedValue(userData)
        manager.getClientByUserID.mockReturnValue(client)
        client.isRegisteredUser.mockResolvedValue(true)
        await request(app).post('/api/waweb/send-message')
            .send({ ...userData, ...sendData })
            .expect('Content-Type', /json/)
            .expect(200)
        expect(client.sendMessage).toHaveBeenCalledTimes(1)
    })
    it('POST /send-message --> 401 password wrong', async () => {
        client.isReady = true

        UserModel.findOne.mockResolvedValue({ ...userData, ...{ password: '21nn21j21' } })

        manager.getClientByUserID.mockReturnValue(client)
        await request(app).post('/api/waweb/send-message')
            .send({ ...userData, ...sendData })
            .expect('Content-Type', /json/)
            .expect(401)
    })
    it('POST /send-message --> 500 client is not ready', async () => {
        client.isReady = false
        UserModel.findOne.mockResolvedValue(userData)
        manager.getClientByUserID.mockReturnValue(client)
        await request(app).post('/api/waweb/send-message')
            .send({ ...userData, ...sendData })
            .expect('Content-Type', /json/)
            .expect(500)
    })
    it('POST /send-message --> 500 no client', async () => {
        UserModel.findOne.mockResolvedValue(userData)
        manager.getClientByUserID.mockReturnValue(undefined)
        await request(app).post('/api/waweb/send-message')
            .send({ ...userData, ...sendData })
            .expect('Content-Type', /json/)
            .expect(500)
    })

    it('POST /send-media --> 200 media sent', async () => {
        client.isReady = true
        UserModel.findOne.mockResolvedValue(userData)
        manager.getClientByUserID.mockReturnValue(client)
        client.isRegisteredUser.mockResolvedValue(true)
        await request(app).post('/api/waweb/send-media')
            .field({ ...sendDataMedia, ...userData })
            .attach('file', './src/test/im.png')
            .expect('Content-Type', /json/)
            .expect(200)
        expect(client.sendMedia).toHaveBeenCalledTimes(1)
    })
    it('POST /send-media --> 400 no file', async () => {
        client.isReady = true
        UserModel.findOne.mockResolvedValue(userData)
        manager.getClientByUserID.mockReturnValue(client)
        await request(app).post('/api/waweb/send-media')
            .field({ ...sendDataMedia, ...userData })
            .expect('Content-Type', /json/)
            .expect(400)
    })
    it('POST /get-contacts --> 200 get waweb contacts', async () => {
        client.isReady = true
        UserModel.findOne.mockResolvedValue(userData)
        manager.getClientByUserID.mockReturnValue(client)

        await request(app).post('/api/waweb/get-contacts')
            .send({ ...userData })
            .expect('Content-Type', /json/)
            .expect(200)
    })
    it('POST /get-contacts --> 404 user is not registered', async () => {
        UserModel.findOne.mockResolvedValue(null)

        await request(app).post('/api/waweb/get-contacts')
            .send({ ...userData })
            .expect('Content-Type', /json/)
            .expect(404)
    })

})
