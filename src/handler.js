const { validationResult } = require('express-validator');


class Handler {
    constructor(clientWaweb) {
        this.clientWaweb = clientWaweb
    }

    sendMessage(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let message = req.body.message
        let number = req.body.number
        number = `${number}@c.us`

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
    
    sendMessages(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let message = req.body.message
        let numbers = req.body.number
        for (let i = 0; i < numbers.length; i++) {
            const num = `${numbers[i]}@c.us`;
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