/* eslint-disable no-undef */
const UserModel = require('./model/user')
jest.mock('./model/user') // this happens automatically with automocking

const ContactsModel = require('./model/contacts')
jest.mock('./model/contacts') // this happens automatically with automocking

const bcrypt = require('bcrypt')
jest.mock('bcrypt') // this happens automatically with automocking

const manager = require('./waweb/manager')
jest.mock('./waweb/manager') // this happens automatically with automocking

// const ClientWaweb = require('./waweb/client')
// jest.mock('./waweb/client') // this happens automatically with automocking

const db = {
    UserModel,
    ContactsModel
}

const Client = require("socket.io-client");
const createServer = require("./ioServer")


describe("my awesome project", () => {
    let io, clientSocket;

    beforeAll((done) => {
        const server = createServer(db, bcrypt, manager)
        server.listen(() => {
            const port = server.address().port;
            clientSocket = new Client(`http://localhost:${port}`);
            clientSocket.on("connect", done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });

    test("should work", (done) => {
        clientSocket.on("hello", (arg) => {
            expect(arg).toBe("world");
            done();
        });
    });