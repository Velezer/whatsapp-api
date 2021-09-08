const { validationResult } = require('express-validator');


class Handler {
    constructor(clientWaweb) {
        this.clientWaweb = clientWaweb
    }

    async sendMessage(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let message = req.body.message
        let number = req.body.number
        number = `${number}@c.us`

        console.log(message)
        console.log(number)
        let numberRegisteredWA = await this.clientWaweb.client.isRegistered(number)
        if (!numberRegisteredWA) {
            return res.status(422).json({
                message: `number is not registered in whatsapp`
            });
        }
        console.log(`numberRegisteredWA`)

        this.clientWaweb.sendMessage(number, message)
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.log(err)
            })
        res.status(200).json({
            message: `called`
        });
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

            let numberRegisteredWA = await this.clientWaweb.client.isRegistered(num)
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
}
module.exports = Handler