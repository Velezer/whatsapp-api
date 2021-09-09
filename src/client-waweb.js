const { Client, MessageMedia } = require('whatsapp-web.js')
const qrcode = require('qrcode')



class ClientWaweb {
    /**
     * 
     * @param {string} id 
     */
    constructor(id) {
        this.id = id
        this.client = this.createClient()
        this.client.initialize();
    }

    setSocket(socket) {
        this.socket = socket

        this._ready()
        this._sendQR()
        this._authSuccess()
        this._authFail()
        this._disconnected()
    }

    createClient() {
        const client = new Client({
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
        });
        return client
    }

    _sendQR() {
        this.client.on('qr', (qr) => {
            console.log('QR RECEIVED', qr);
            qrcode.toDataURL(qr, (err, url) => {
                this.socket.emit('qr', url);
                this.socket.emit('log', 'QR received');
            });
        });
    }

    _ready() {
        this.client.on('ready', () => {
            this.socket.emit('ready', 'Whatsapp is ready!');
            this.socket.emit('log', 'Whatsapp is ready!');

        });
    }

    _authSuccess() {
        this.client.on('authenticated', (session) => {
            this.socket.emit('authenticated', 'Whatsapp is authenticated!');
            this.socket.emit('log', 'Whatsapp is authenticated!');

            console.log('AUTHENTICATED', session);
            // sessionCfg = session;
            // fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
            //   if (err) {
            //     console.error(err);
            //   }
            // });
        });
    }

    _authFail() {
        this.client.on('auth_failure', function () {
            this.socket.emit('auth_failure', 'Auth failure, restarting...');
            this.socket.emit('log', 'Auth failure, restarting...');
        });
    }

    _disconnected() {
        this.client.on('disconnected', () => {
            this.socket.emit('disconnected', 'Whatsapp is disconnected!');
            this.socket.emit('log', 'Whatsapp is disconnected!');
            // fs.unlinkSync(SESSION_FILE_PATH, function (err) {
            //     if (err) return console.log(err);
            //     console.log('Session file deleted!');
            // });
            this.client.destroy();
        });
    }
    /**
     * 
     * @param {string} number 
     * @param {string} message 
     * @returns 
     */
    sendMessage(number, message) {
        return this.client.sendMessage(number, message)
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
        return this.client.sendMessage(number, media, { caption: caption })
    }

}

module.exports = { ClientWaweb }