const { Client } = require('whatsapp-web.js');

const client = new Client({
    puppeteer: {
        executablePath: `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`,
        headless: false
    }
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();
