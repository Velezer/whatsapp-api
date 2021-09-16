const { Client, MessageMedia } = require('whatsapp-web.js')
const qrcode = require('qrcode')
const { SessionModel } = require('../model/session')
const sstring = require('./saved-string')


class ClientWaweb extends Client {

    constructor(sessionData) {
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
            session: sessionData.session
        })
        this.sessionData = sessionData


        this.initialize();
        this.isReady = false
        this.receivers = []

    }

    /**
     * @param {*} socket 
     */
    setEmitter(socket) {
        this.emitter = socket
        this._listenAllEvents()
    }

    _listenAllEvents() {
        this.on('qr', async (qr) => {
            console.log('QR RECEIVED', qr);
            qrcode.toDataURL(qr, (err, url) => {
                this.emitter.emit('qr', url);
                this.emitter.emit('log', 'QR received');
            });
        });

        this.on('authenticated', async (session) => {
            this.emitter.emit('authenticated', 'Whatsapp is authenticated!');
            this.emitter.emit('log', 'Whatsapp is authenticated!');

            const res = await SessionModel.updateOne({ user_id: this.sessionData.user_id }, {
                $set: { session: session }
            })
            this.emitter.emit('log', `user_id: ${this.sessionData.user_id}`)
            console.log(`SessionModel.updateOne res= `, res)
            this.sessionData.session = session
            console.log(`AUTHENTICATED with user_id=${this.sessionData.user_id}`)
        });

        this.on('ready', async () => {
            this.isReady = true


            this.emitter.emit('ready', 'Whatsapp is ready!');
            this.emitter.emit('log', 'Whatsapp is ready!');

        });

        this.on('auth_failure', async function () {
            this.emitter.emit('auth_failure', 'Auth failure, restarting...');
            this.emitter.emit('log', 'Auth failure, restarting...');
            // const res = await SessionModel.deleteOne({ _id: this._id })
            // console.log('delete session:', res)
            // if (res.deletedCount > 0) {
            //     this._id = null
            // }
        });

        this.on('disconnected', async (reason) => {
            this.emitter.emit('disconnected', 'Whatsapp is disconnected!');
            this.emitter.emit('log', 'Whatsapp is disconnected!');

            console.log('disconnected:', reason)
            this.destroy();

            this._id = null
        });

        this.on('message', async (message) => {
            if (this.isActive) {
                if (message.body.startsWith('///activate')) {
                    message.reply('already activated')
                }
                if (message.body == '///deactivate') {
                    this.isActive = false
                    message.reply('deactivation success')
                }
                if (message.body.startsWith('///send_media\n') && message.hasMedia) {
                    const cap = message.body.split('///send_media\n')[1]
                    const attachmentData = await message.downloadMedia()
                    for (const i in this.receivers) {
                        const receiver = this.receivers[i];
                        this.sendMessage(receiver, attachmentData, { caption: cap })
                    }
                    message.reply('_report!_\nmedia sent')
                }
                if (message.body.startsWith('///send_message\n')) {
                    const mess = message.body.split('///send_message\n')[1]
                    for (const i in this.receivers) {
                        const receiver = this.receivers[i];
                        this.sendMessage(receiver, mess)
                    }
                    message.reply('_report!_\nmessage sent')
                }
                if (message.body == '///empty_receivers') {
                    this.receivers = []
                    message.reply(`_report!_\nreceivers: ${this.receivers.length}`)
                }
                if (message.body.startsWith('///add_receivers\n')) {
                    const numbers = message.body.split('\n')
                    for (let i = 1; i < numbers.length; i++) {// i=1 to get number
                        const number = numbers[i] + '@c.us';
                        this.receivers.push(number)
                    }
                    message.reply(`_report!_\nreceivers: ${this.receivers.length}`)
                }
                if (message.body == '///get_contacts') {
                    const contacts = await this.getContacts()
                    let reply = ''
                    contacts.forEach(contact => {
                        reply += contact.number + '\n'
                    })
                    message.reply(`_report!_\n${reply}`)
                }
            } else {
                if (message.body == `///activate ${this.sessionData.user} ${this.sessionData.password}`) {
                    this.isActive = true
                    message.reply(sstring.activation_success)
                }
            }

        });

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


module.exports = { ClientWaweb }