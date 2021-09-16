const { Client, MessageMedia } = require('whatsapp-web.js')


class ModifiedClient extends Client {

    constructor(session) {
        super({
            restartOnAuthFail: true,
            puppeteer: {
                // executablePath: `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`,
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process', // <- this one doesn't works in Windows
                    '--disable-gpu'
                ],
            },
            session: session
        })
    }

    /**
     * @param {string} number 
     * @param {*} file
     * @param {string} caption 
     * @returns Promise<WAWebJS.Message>
     * @todo send media
     */
    async sendMedia(number, file, caption) {
        const base64Data = file.data.toString('base64')
        const media = new MessageMedia(file.mimetype, base64Data, file.name)
        return await super.sendMessage(number, media, { caption: caption })
    }
    /**
     * 
     * @returns Promise<WAWebJS.Contact[]>
     */
    async getContacts() {
        let contacts = await super.getContacts()
        contacts.forEach(contact => {
            const keys = Object.keys(contact)
            keys.forEach(key => {
                if (key !== `number` &&
                    key !== `name` &&
                    key !== `pushname` &&
                    key !== `shortName` &&
                    key !== `verifiedName`) {
                    delete contact[key] // delete unused property
                }
            });
        })
        contacts = contacts.filter(contact => contact.number !== null)
        return contacts
    }

}


module.exports = { ModifiedClient }