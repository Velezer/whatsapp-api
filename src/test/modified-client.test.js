/* eslint-disable no-undef */
const ModifiedClient = require("../waweb/modified-client")
const { Client, MessageMedia } = require("whatsapp-web.js")
jest.mock("whatsapp-web.js")



describe('test modified-client', () => {
    let mClient
    beforeAll(() => {
        mClient = new ModifiedClient()
        expect(Client).toHaveBeenCalledTimes(1)
    })

    it('sendMedia method', (done) => {
        const file = {
            data: 'nsda9dnasd0s',
            mimetype: 'image/jpeg',
            name: 'file'
        }
        mClient.sendMedia('62343284983', file, 'caption')
        expect(MessageMedia).toHaveBeenCalledTimes(1)
        expect(Client.prototype.sendMessage).toHaveBeenCalledTimes(1)
        done()
    })
    it('getContacts method', async () => {
        const contactsDataDirty = [
            { number: `682713223833`, spam: `spam` },
            { number: `682713299833`, name: `name`, dadan: `80js` },
            { number: `682713121833` }
        ]
        const contactsData = [
            { number: `682713223833` },
            { number: `682713299833`, name: `name` },
            { number: `682713121833` }
        ]
        Client.prototype.getContacts.mockResolvedValue(contactsDataDirty)
        const contacts = await mClient.getContacts()
        expect(contacts).toStrictEqual(contactsData)
    })

})