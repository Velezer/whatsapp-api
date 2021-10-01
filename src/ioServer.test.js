/* eslint-disable no-undef */
const UserModel = require('./model/user')
jest.mock('./model/user') // this happens automatically with automocking

const ContactsModel = require('./model/contacts')
jest.mock('./model/contacts') // this happens automatically with automocking

const bcrypt = require('bcrypt')
jest.mock('bcrypt') // this happens automatically with automocking

const manager = require('./waweb/manager')
jest.mock('./waweb/manager') // this happens automatically with automocking

const ClientWaweb = require('./waweb/client')
jest.mock('./waweb/client') // this happens automatically with automocking

jest.setTimeout(15000)

const db = {
    UserModel,
    ContactsModel
}

const Client = require("socket.io-client")
const createServer = require("./ioServer")

const server = createServer(db, bcrypt, manager)
let port = 5555
server.listen(port)

// describe('auth fail', () => {
//     let clientSocket
//     const userData = {
//         user: 'user',
//         password: 'password',
//         number: '628173190130'
//     }
//     beforeAll((done) => {
//         UserModel.findOne.mockReturnThis()
//         UserModel.populate.mockResolvedValue(null)

//         clientSocket = new Client(`http://localhost:${port}`, userData)
//         clientSocket.on('connect', done)
//         done()
//     })

//     afterAll(() => {
//         clientSocket.close()
//     })

//     it('pass ioApp middleware', (done) => {
//         clientSocket.on('log', (arg) => {
//             expect(arg).toBe(`no user withr: ${user} and number: ${number}`)

//         })
//         done()
//     })


// })

describe('ioApp', () => {
    let clientSocket

    const userData = {
        user: 'user',
        password: 'password',
        number: '628173190130'
    }
    const client = new ClientWaweb(userData)

    beforeAll((done) => {
        UserModel.findOne.mockReturnThis()
        UserModel.populate.mockResolvedValue(userData)
        manager.createClient.mockReturnValue(client)
        bcrypt.compareSync.mockReturnValue(true)

        clientSocket = new Client(`http://localhost:${port}`, userData)
        done()
    })

    afterAll(() => {
        clientSocket.close()
    })

    it('pass ioApp middleware and connected', (done) => {
        clientSocket.on('ioAuth', (arg) => {
            expect(arg).toBe(`login success`)
        })
        clientSocket.on('ioCreateClient', (arg) => {
            expect(arg).toBe(`creating client...`)
        })
        clientSocket.on('connected', (arg) => {
            expect(arg).toBe(`connected`)
            done()
        })
    })

})