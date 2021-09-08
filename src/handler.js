
class Handler {
    constructor(clientWaweb) {
        this.clientWaweb = clientWaweb
    }
    sendMessage(req, res) {
        let number = `6283842455250@c.us`
        this.clientWaweb.sendMessage(number, `world`)
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
        let numbers = [`6283842455250@c.us`, `6283842455250@c.us`, `6283842455250@c.us`]
        for (let i = 0; i < numbers.length; i++) {
            const num = numbers[i];
            this.clientWaweb.sendMessage(num, `world${i}`)
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