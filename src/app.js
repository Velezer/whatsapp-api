const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

createClient()
function createClient() {
    const client = new Client({
        puppeteer: {
            executablePath: `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`,
            headless: true
        }
    });

    client.initialize();

    client.on('qr', (qr) => {
        // Generate and scan this code with your phone
        console.log('QR RECEIVED', qr);
        qrcode.generate(qr)
    });

    client.on('ready', () => {
        console.log('Client is ready!');
    });
    
    client.on('message', msg => {
        if (msg.body == '!ping') {
            msg.reply('pong');
            console.log('pong');
        }
    });

}
