const { Client, MessageMedia, Events } = require('whatsapp-web.js')
const qrcode = require('qrcode')

class WaWebEmitter {
    /**
     * 
     * @param {*} socket 
     * @param {string} clientID 
     */
    constructor(socket, clientID) {
        this.socket = socket
        this.clientID = clientID
    }
    /**
     * 
     * @param {string} eventName 
     * @param {*} data 
     */
    emit(eventName, data) {
        this.socket.emit(`${this.clientID}-${eventName}`, data);
    }
}



class ClientWaweb extends Client {
    /**
     * 
     * @param {string} id 
     */
    constructor(id) {
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
            }
        })

        this.id = id
    }

    setEmitter(socket) {
        this.emitter = new WaWebEmitter(socket, this.id)
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
            // sessionCfg = session;
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

module.exports = { ClientWaweb }