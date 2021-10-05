/* eslint-disable no-undef */
const UserModel = require('../model/user')
jest.mock('../model/user')

const ContactsModel = require('../model/contacts')
jest.mock('../model/contacts')

const bcrypt = require('bcrypt')
jest.mock('bcrypt')

const ManagerWaweb = require('../waweb/manager')
const manager = new ManagerWaweb()
manager.createClient = jest.fn()

const ClientWaweb = require('../waweb/client')
jest.mock('../waweb/client')

jest.setTimeout(15000)

const db = {
    UserModel,
    ContactsModel
}

const Client = require("socket.io-client")
const createServer = require("../ioServer")

const server = createServer(db, bcrypt, manager)
let port = 5555
server.listen(port)


describe('ioApp no auth', () => {
    let clientSocket

    afterEach(() => {
        clientSocket.close()
    })

    it('validation failed', (done) => {
        clientSocket = new Client(`http://localhost:${port}`)
        clientSocket.on('connect_error', (err) => {
            expect(err.message).toBe(`validation failed on user, password, and number`)
            expect(err.data.code).toBe(400)
            done()
        })
    })

})

describe('ioApp with auth', () => {
    let clientSocket

    const userData = {
        user: 'user',
        password: 'password',
        number: '628173190130'
    }
    const client = new ClientWaweb(userData)

    beforeEach((done) => {
        clientSocket = new Client(`http://localhost:${port}`, { auth: userData })
        done()
    })

    afterEach(() => {
        clientSocket.close()
    })

    it('user not found', (done) => {
        UserModel.findOne.mockReturnThis()
        UserModel.populate.mockResolvedValue(null)
        clientSocket.on('connect_error', (err) => {
            expect(err.message).toBe('user not found')
            expect(err.data.code).toBe(404)
            done()
        })
    })
    it('password wrong', (done) => {
        UserModel.findOne.mockReturnThis()
        UserModel.populate.mockResolvedValue(userData)
        bcrypt.compareSync.mockReturnValue(false)
        clientSocket.on('connect_error', (err) => {
            expect(err.message).toBe('password wrong')
            expect(err.data.code).toBe(401)
            done()
        })
    })
    it('pass ioApp middlewares and connected', (done) => {
        UserModel.findOne.mockReturnThis()
        UserModel.populate.mockResolvedValue(userData)
        manager.createClient.mockReturnValue(client)
        bcrypt.compareSync.mockReturnValue(true)

        clientSocket.on('ioAuth', (arg) => { // passed ioAuth middleware
            expect(arg).toBe(`ioAuth`)
        })
        clientSocket.on('ioCreateClient', (arg) => { // passed ioCreateClient middleware
            expect(arg).toBe(`ioCreateClient`)
            expect(manager.clients.length).toBe(1)
        })

        clientSocket.on('connected', (arg) => {
            expect(arg).toBe(`connected`)
            done()
        })
    })

})