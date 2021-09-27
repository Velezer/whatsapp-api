const qrcode = require('qrcode')
const { SessionModel } = require('../model/session')
const sstring = require('./saved-string')
const { ModifiedClient } = require('./modified-client')
const bcrypt = require("bcrypt")


class ClientWaweb extends ModifiedClient {
    /**
     * 
     * @param {object} userData 
     */
    constructor(userData) {
        super(userData.session)
        this.userData = userData

        this.initialize();
        this.isReady = false
        this.receivers = []
    }

    /**
     * @param {*} socket 
     */
    setEmitter(socket) {
        this.emitter = socket

        this.on('qr', async (qr) => {
            console.log('QR RECEIVED', qr);
            qrcode.toDataURL(qr, (err, url) => {
                this.emitter.emit('qr', url);
                this.emitter.emit('log', 'QR received');
            });
        });

        this.on('authenticated', async (session) => {
            this.emitter.emit('authenticated', 'Authenticated!')
            this.emitter.emit('log', 'Authenticated! Please wait it until ready')

            console.log(`AUTHENTICATED with user=${this.userData.user}`)
            SessionModel.updateSession(this.userData.session, session)
        });

        this.on('ready', async () => {
            const myNumber = await this.getContactById(`${this.userData.number}@c.us`)
            if (!myNumber.isMe) {
                this.emitter.emit('log', 'This is not your number')
                this.emitter.emit('log', 'Logout...')
                this.destroy()
                return
            }
            this.isReady = true

            this.emitter.emit('ready', 'Whatsapp is ready!')
            this.emitter.emit('log', 'Whatsapp is ready!')

        });

        this.on('auth_failure', async function () {
            this.emitter.emit('auth_failure', 'Auth failure, restarting...')
            this.emitter.emit('log', 'Auth failure, restarting...')
        });

        this.on('disconnected', async (reason) => {
            this.emitter.emit('disconnected', 'Whatsapp is disconnected!')
            this.emitter.emit('log', 'Whatsapp is disconnected!')

            console.log('disconnected:', reason)
            this.destroy()
            this.isReady = false
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
                const body = message.body.split(' ')
                if (`${body[0]} ${body[1]}` == `///activate ${this.userData.user} `) {
                    if (bcrypt.compareSync(body[2], this.userData.password)) {
                        this.isActive = true
                        message.reply(sstring.activation_success)
                    }

                }
            }

        });

    }

}


module.exports = { ClientWaweb }