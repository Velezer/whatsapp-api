const { Client, MessageMedia } = require('whatsapp-web.js')
const qrcode = require('qrcode')
const { SessionModel } = require('./model')

class WaWebEmitter {
    /**
     * 
     * @param {*} socket 
     * @todo emit event to frontend client
     * 
     */
    constructor(socket) {
        this.socket = socket
    }
    /**
     * 
     * @param {string} eventName 
     * @param {*} data 
     */
    emit(eventName, data) {
        this.socket.emit(`${eventName}`, data);
    }
}

class ManagerWaweb {
    /**
     * @todo choose client when send-message
     */
    constructor() {
        this.clients = []
    }
    /**
     * 
     * @param {*} clientWaweb 
     */
    pushClient(clientWaweb) {
        this.clients.push(clientWaweb)
    }

    getClient(sessionCfg) {
        return this.clients.find((client) => client.sessionCfg === sessionCfg)
    }




}

class ClientWaweb extends Client {

    constructor(sessionCfg) {
        super({
            puppeteer: {
                executablePath: `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`,
                headless: false,
                args: [
                    '--no-sandbox',
                    // '--disable-setuid-sandbox',
                    // '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    // '--no-first-run',
                    // '--no-zygote',
                    // //   '--single-process', // <- this one doesn't works in Windows
                    // '--disable-gpu'
                ],
            },
            session: sessionCfg
        })
        this.sessionCfg = sessionCfg

        this.initialize();
        this._listenAllEvents()

    }

    setEmitter(socket) {
        this.emitter = new WaWebEmitter(socket)
    }

    _listenAllEvents() {
        this.on('qr', (qr) => {
            console.log('QR RECEIVED', qr);
            qrcode.toDataURL(qr, (err, url) => {
                this.emitter.emit('qr', url);
                this.emitter.emit('log', 'QR received');
            });
        });

        this.on('ready', () => {
            this.emitter.emit('ready', 'Whatsapp is ready!');
            this.emitter.emit('log', 'Whatsapp is ready!');

        });

        this.on('authenticated', async (session) => {
            this.emitter.emit('authenticated', 'Whatsapp is authenticated!');
            this.emitter.emit('log', 'Whatsapp is authenticated!');


            const sessionModel = new SessionModel({ session })
            await sessionModel.save()
            console.log(`AUTHENTICATED and session saved`)
            console.log(sessionModel)
        });

        this.on('auth_failure', function () {
            this.emitter.emit('auth_failure', 'Auth failure, restarting...');
            this.emitter.emit('log', 'Auth failure, restarting...');
        });

        this.on('disconnected', async () => {
            this.emitter.emit('disconnected', 'Whatsapp is disconnected!');
            this.emitter.emit('log', 'Whatsapp is disconnected!');

            const res = await SessionModel.deleteOne(this.sessionCfg)
            console.log(res)
            this.destroy();
        });
    }
    /**
     * 
     * @param {string} number 
     * @param {string} message 
     * @returns 
     */
    sendMessage(number, message) {
        return super.sendMessage(number, message)
    }
    /**
     * 
     * @param {string} number 
     * @param {*} file 
     * @param {string} caption 
     * @returns 
     */
    sendMedia(number, file, caption) {
        const base64Data = file.data.toString('base64')
        const media = new MessageMedia(file.mimetype, base64Data, file.name)
        return super.sendMessage(number, media, { caption: caption })
    }

}

let manager = new ManagerWaweb()

module.exports = { ClientWaweb, manager }