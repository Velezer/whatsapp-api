/* eslint-disable no-undef */
const ClientWaweb = require('../waweb/client')
jest.mock('../waweb/client')

const ManagerWaweb = require('../waweb/manager')
const manager = new ManagerWaweb()

describe('manager', () => {

    beforeEach(() => {
        ClientWaweb.mockClear();
    });

    it('0 clients', () => {
        expect(manager.clients.length).toBe(0)
    })

    it('1 clients', () => {
        const client1 = manager.createClient()
        client1.userData = {
            _id: '97y799m0099m'
        }
        expect(ClientWaweb).toHaveBeenCalledTimes(1)

        manager.pushClient(client1)
        expect(manager.clients.length).toBe(1)

        const client2 = manager.getClientByUserID(client1.userData._id)
        expect(client2).toBe(client1)

        const clientNotFound = manager.getClientByUserID('asdodjsxj09w')
        expect(clientNotFound).toBeFalsy()
    })

})