const { Client, MessageMedia, Events } = require('whatsapp-web.js')
const qrcode = require('qrcode')

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

    pushClient(clientWaweb) {
        this.clients.push(clientWaweb)
    }

    getClient(id) {
        return this.clients.find((client) => client.id === id)
    }


}

class ClientWaweb extends Client {

    constructor(sessionCfg, sessionModel) {
        super({
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
                    //   '--single-process', // <- this one doesn't works in Windows
                    '--disable-gpu'
                ],
            },
            session: sessionCfg
        })

        this.sessionModel = sessionModel

    }

    setEmitter(socket) {
        this.emitter = new WaWebEmitter(socket)
        this._listenAllEvents()
    }

    _listenAllEvents() {
        this.on(Events.QR_RECEIVED, (qr) => {
            console.log('QR RECEIVED', qr);
            qrcode.toDataURL(qr, (err, url) => {
                this.emitter.emit('qr', url);
                this.emitter.emit('log', 'QR received');
            });
        });

        this.on(Events.READY, () => {
            this.emitter.emit('ready', 'Whatsapp is ready!');
            this.emitter.emit('log', 'Whatsapp is ready!');

        });

        this.on(Events.AUTHENTICATED, (session) => {
            this.initialize();

            this.emitter.emit('authenticated', 'Whatsapp is authenticated!');
            this.emitter.emit('log', 'Whatsapp is authenticated!');

            console.log('AUTHENTICATED', session);
            const sessionCfg = session;
            this.sessionModel.save(sessionCfg)
            // fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
            //   if (err) {
            //     console.error(err);
            //   }
            // });

        });

        this.on(Events.AUTHENTICATION_FAILURE, function () {
            this.emitter.emit('auth_failure', 'Auth failure, restarting...');
            this.emitter.emit('log', 'Auth failure, restarting...');
        });

        this.on(Events.DISCONNECTED, () => {
            this.emitter.emit('disconnected', 'Whatsapp is disconnected!');
            this.emitter.emit('log', 'Whatsapp is disconnected!');
            // fs.unlinkSync(SESSION_FILE_PATH, function (err) {
            //     if (err) return console.log(err);
            //     console.log('Session file deleted!');
            // });
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

module.exports = { ClientWaweb, ManagerWaweb }