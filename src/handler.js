const { validationResult } = require('express-validator');
const { ImageFileuploadValidationResult } = require('./validator')

class Handler {
    constructor(manager) {
        this.manager = manager
    }

    async sendMessages(req, res) {
        console.log(`sendMessages`)

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // validation end

        const { _id, message, numbers } = req.body

        let client = this.manager.getClient(_id)
        if (client == undefined) {
            const sessionData = await this.manager.findSession(_id)
            client = this.manager.createClient(sessionData)
        } else {
            if (client.isDestroyed) {
                this.manager.destroyClient(_id)
                return res.status(500).json({ message: `client is disconnected` })
            }
            if (!client.isReady) {
                return res.status(500).json({ message: `client is not ready. please, wait for a minute` })
            }
        }
        for (let i = 0; i < numbers.length; i++) {
            const num = `${numbers[i]}@c.us`;

            let numberRegisteredWA = await client.isRegisteredUser(num)
            if (numberRegisteredWA) {
                client.sendMessage(num, message)
            }
        }
        res.status(200).json({
            message: `called`
        });
    }

    async sendMedia(req, res) {
        console.log(`sendMedia`)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const fileErrors = new ImageFileuploadValidationResult(req)
        if (!fileErrors.isEmpty()) {
            return res.status(400).json({ errors: fileErrors.array() });
        }

        // validation end

        const { _id, caption, numbers } = req.body

        const file = req.files.file

        let client = this.manager.getClient(_id)
        if (client == undefined) {
            const sessionData = await this.manager.findSession(_id)
            client = this.manager.createClient(sessionData)
        } else {
            if (client.isDestroyed) {
                this.manager.destroyClient(_id)
                return res.status(500).json({ message: `client is disconnected` })
            }
            if (!client.isReady) {
                return res.status(500).json({ message: `client is not ready. please, wait for a minute` })
            }
        }
        for (let i = 0; i < numbers.length; i++) {
            const num = `${numbers[i]}@c.us`;

            let numberRegisteredWA = await client.isRegisteredUser(num)
            if (!numberRegisteredWA) {
                client.sendMedia(num, file, caption)
            }
        }
        res.status(200).json({
            message: `called`
        });
    }
}
module.exports = Handler