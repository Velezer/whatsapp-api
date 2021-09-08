const { Client } = require('whatsapp-web.js')
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
                executablePath: `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`,
                headless: true,
                args: [
                    '--no-sandbox',
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
            });
        });
    }

    _ready() {
        this.client.on('ready', () => {
            this.socket.emit('ready', 'Whatsapp is ready!');
        });
    }

    _authSuccess() {
        this.client.on('authenticated', (session) => {
            this.socket.emit('authenticated', 'Whatsapp is authenticated!');
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
        });
    }

    _disconnected() {
        this.client.on('disconnected', () => {
            this.socket.emit('disconnected', 'Whatsapp is disconnected!');
            // fs.unlinkSync(SESSION_FILE_PATH, function (err) {
            //     if (err) return console.log(err);
            //     console.log('Session file deleted!');
            // });
            this.client.destroy();
        });
    }

    sendMessage(number, message) {
        return this.client.sendMessage(number, message)
    }

}

module.exports = { ClientWaweb }