/* eslint-disable no-undef */
const ClientWaweb = require("../waweb/client")
const ModifiedClient = require("../waweb/modified-client")
jest.mock("../waweb/modified-client")

const bcrypt = require("bcrypt")

const userData = {
    user: 'user',
    password: 'password',
    number: '628173190130',
    session: {}
}

describe('client waweb test', () => {

    beforeEach(() => {
        jest.resetAllMocks()
    })


    it('create client', () => {
        const client = new ClientWaweb(userData)
        expect(client.isReady).toBe(false)
        expect(ModifiedClient).toHaveBeenCalledTimes(1)

        client.setEmitter(jest.fn())
        expect(JSON.stringify(client.emitter)).toBe(JSON.stringify(jest.fn()))
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
        await client._cliLogic(wawebMessage)
        expect(client.isActive).toBe(true)
        expect(wawebMessage.reply).toHaveBeenCalledTimes(1)
    })


})

describe('client waweb cli active', () => {
    let client
    beforeAll(() => {
        client = new ClientWaweb(userData)
        client.isActive = true
        client.getContacts = jest.fn()
        client.sendMessage = jest.fn()
    })
    beforeEach(() => {
        jest.resetAllMocks()
    })
    it('already activated', async () => {
        const wawebMessage = {
            body: `///activate ${userData.user} password`,
            reply: jest.fn()
        }
        await client._cliLogic(wawebMessage)
        expect(client.isActive).toBe(true)
        expect(wawebMessage.reply).toHaveBeenCalledTimes(1)
    })
    it('add_receivers', async () => {
        const wawebMessage = {
            body: `///add_receivers\n62813721830\n8872132132`,
            reply: jest.fn()
        }
        await client._cliLogic(wawebMessage)
        expect(client.isActive).toBe(true)
        expect(client.receivers.length).toBe(2)
        expect(wawebMessage.reply).toHaveBeenCalledTimes(1)
    })
    it('send_message', async () => {
        const wawebMessage = {
            body: `///send_message\nmess`,
            reply: jest.fn()
        }
        await client._cliLogic(wawebMessage)
        expect(client.isActive).toBe(true)
        expect(client.receivers.length).toBe(2)
        expect(client.sendMessage).toHaveBeenCalledTimes(2)
        expect(wawebMessage.reply).toHaveBeenCalledTimes(1)
    })
    it('send_media', async () => {
        const wawebMessage = {
            body: `///send_media\nmess`,
            reply: jest.fn(),
            hasMedia: true,
            downloadMedia: jest.fn()
        }
        await client._cliLogic(wawebMessage)
        expect(client.isActive).toBe(true)
        expect(client.receivers.length).toBe(2)
        expect(client.sendMessage).toHaveBeenCalledTimes(2)
        expect(wawebMessage.reply).toHaveBeenCalledTimes(1)
    })

    // from this line receivers become 0
    it('empty_receivers', async () => {
        const wawebMessage = {
            body: `///empty_receivers`,
            reply: jest.fn()
        }
        await client._cliLogic(wawebMessage)
        expect(client.isActive).toBe(true)
        expect(client.receivers.length).toBe(0)
        expect(wawebMessage.reply).toHaveBeenCalledTimes(1)
    })
    it('get_contacts`', async () => {
        const wawebMessage = {
            body: `///get_contacts`,
            reply: jest.fn()
        }
        client.getContacts.mockResolvedValue([{ number: '62372931212' }])
        await client._cliLogic(wawebMessage)
        expect(client.isActive).toBe(true)
        expect(wawebMessage.reply).toHaveBeenCalledTimes(1)
    })

    it('deactivate', async () => {
        const wawebMessage = {
            body: `///deactivate`,
            reply: jest.fn()
        }
        await client._cliLogic(wawebMessage)
        expect(client.isActive).toBe(false)
        expect(wawebMessage.reply).toHaveBeenCalledTimes(1)
    })
})