const { validationResult } = require('express-validator');
const { ImageFileuploadValidationResult } = require('./validator')
const { manager } = require('./client-waweb')

class Helper {
    static getClient(_id) {
        const client = manager.getClient(_id)
        if (client == undefined) {
            return { client: null, err: `no client with _id ${_id}. create a client first` };
        }
        if (client.isDestroyed) {
            manager.destroyClient(_id)
            return { client: null, err: `client is disconnected` };
        }
        if (!client.isReady) {
            return { client: null, err: `client is not ready. please, wait for a minute` };
        }
        return { client, err: null }
    }

}

class Handler {

    static async sendMessage(req, res) {
        console.log(`sendMessage`)

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // validation end

        const { _id, message, numbers } = req.body

        const { client, err } = Helper.getClient(_id)
        if (client == null) {
            return res.status(500).json({ message: err })
        }

        for (let i = 0; i < numbers.length; i++) {
            const num = `${numbers[i]}@c.us`;

            let numberRegisteredWA = await client.isRegisteredUser(num)
            if (numberRegisteredWA) {
                client.sendMessage(num, message)
            }
        }
        res.status(200).json({
            _id: client._id,
            message: `send-message called`
        });
    }

    static async sendMedia(req, res) {
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

        const { client, err } = Helper.getClient(_id)
        if (client == null) {
            return res.status(500).json({ message: err })
        }

        for (let i = 0; i < numbers.length; i++) {
            const num = `${numbers[i]}@c.us`;

            let numberRegisteredWA = await client.isRegisteredUser(num)
            if (!numberRegisteredWA) {
                client.sendMedia(num, file, caption)
            }
        }
        res.status(200).json({
            _id: client._id,
            message: `send-media called`
        });
    }

    static async getContacts(req, res) {
        console.log(`getContacts`)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // validation end

        const { _id } = req.body

        const { client, err } = Helper.getClient(_id)
        if (client == null) {
            return res.status(500).json({ message: err })
        }

        const contacts = await client.getContacts()
        res.status(200).json({
            _id: client._id,
            contacts,
            message: `contacts called`
        });
    }
}
module.exports = Handler