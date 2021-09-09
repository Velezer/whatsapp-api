const { validationResult } = require('express-validator');
const { ImageFileuploadValidationResult } = require('./validator')

class Handler {
    constructor(clientWaweb) {
        this.clientWaweb = clientWaweb
    }

    async sendMessages(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let message = req.body.message
        let numbers = req.body.numbers
        for (let i = 0; i < numbers.length; i++) {
            const num = `${numbers[i]}@c.us`;

            let numberRegisteredWA = await this.clientWaweb.client.isRegisteredUser(num)
            if (!numberRegisteredWA) {
                continue
            }

            this.clientWaweb.sendMessage(num, message)
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

        let caption = req.body.caption
        let numbers = req.body.numbers
        let file = req.files.file

        for (let i = 0; i < numbers.length; i++) {
            const num = `${numbers[i]}@c.us`;

            let numberRegisteredWA = await this.clientWaweb.client.isRegisteredUser(num)
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