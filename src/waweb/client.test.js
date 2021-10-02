/* eslint-disable no-undef */
const ClientWaweb = require("./client")
const ModifiedClient = require("./modified-client")
jest.mock("./modified-client")
const bcrypt = require("bcrypt")

describe('client waweb test', () => {
    const userData = {
        user: 'user',
        password: 'password',
        number: '628173190130',
        session: {}
    }

    beforeEach(() => {
        ModifiedClient.mockClear()
    })


    it('create client', () => {
        const client = new ClientWaweb(userData)
        expect(client.isReady).toBe(false)
        expect(ModifiedClient).toHaveBeenCalledTimes(1)

        client.setEmitter({})
        expect(client.emitter).toStrictEqual({})
    })

    it('activate cli', async () => {
        const hashed = bcrypt.hashSync(userData.password, 1)
        userData.password = hashed
        const client = new ClientWaweb(userData)

        expect(client.isActive).toBeFalsy()

        const wawebMessage = {
            body: `///activate ${userData.user} password`,
            reply: jest.fn()
        }
        await client._CLILogic()
        expect(client.isActive).toBe(true)
        expect(wawebMessage.reply).toHaveBeenCalledTimes(1)
    })

})