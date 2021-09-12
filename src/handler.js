const { validationResult } = require('express-validator');
const { ImageFileuploadValidationResult } = require('./validator')

class Handler {
    constructor(manager) {
        this.manager = manager
    }

    async sendMessages(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { _id, message, numbers } = req.body

        const client = this.manager.getClient(_id)
        for (let i = 0; i < numbers.length; i++) {
            const num = `${numbers[i]}@c.us`;

            let numberRegisteredWA = await client.isRegisteredUser(num)
            if (!numberRegisteredWA) {
                continue
            }

            client.sendMessage(num, message)
                .then(response => {
                    console.log(response)
                })
                .catch(err => {
                    console.log(err)
                })
        }
        res.status(200).json({
            message: `called`
        });
    }

    async sendMedia(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const fileErrors = new ImageFileuploadValidationResult(req)
        if (!fileErrors.isEmpty()) {
            return res.status(400).json({ errors: fileErrors.array() });
        }

        const { sender_id, caption, numbers } = req.body
        const file = req.files.file


        const client = this.manager.getClient(sender_id)

        for (let i = 0; i < numbers.length; i++) {
            const num = `${numbers[i]}@c.us`;

            let numberRegisteredWA = await client.isRegisteredUser(num)
            if (!numberRegisteredWA) {
                continue
            }

            this.clientWaweb.sendMedia(num, file, caption)
                .then(response => {
                    console.log(response)
                })
                .catch(err => {
                    console.log(err)
                })
        }
        res.status(200).json({
            message: `called`
        });
    }
}
module.exports = Handler