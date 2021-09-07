const { Client } = require('whatsapp-web.js')
const qrcode = require('qrcode')



class ClientWaweb {
    constructor() {
        this.client = this.createClient()
        this.client.initialize();
    }

    setSocket(socket){
        this.socket = socket

        this.isReady()
        this.sendQR()
        this.authSuccess()
        this.authFail()
        this.disconnected()
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

    sendQR() {
        this.client.on('qr', (qr) => {
            console.log('QR RECEIVED', qr);
            qrcode.toDataURL(qr, (err, url) => {
                this.socket.emit('qr', url);
                this.socket.emit('qr', 'QR Code received, scan please!');
            });
        });
    }

    isReady() {
        this.client.on('ready', () => {
            this.socket.emit('ready', 'Whatsapp is ready!');
        });
    }

    authSuccess() {
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

    authFail() {
        this.client.on('auth_failure', function (session) {
            this.socket.emit('auth_failure', 'Auth failure, restarting...');
        });
    }

    disconnected() {
        this.client.on('disconnected', (reason) => {
            this.socket.emit('disconnected', 'Whatsapp is disconnected!');
            fs.unlinkSync(SESSION_FILE_PATH, function (err) {
                if (err) return console.log(err);
                console.log('Session file deleted!');
            });
            this.client.destroy();
        });
    }

    sendMessage(number,message){
        return this.client.sendMessage(number,message)
    }

}

module.exports= { ClientWaweb }