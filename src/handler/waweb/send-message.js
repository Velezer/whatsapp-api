const { validationResult } = require('express-validator');
const { Helper } = require('./helper')


module.exports = async (req, res) => {
    console.log(`sendMessage`)

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // validation end

    const { user, password, number } = req.body

    const { client, code, err } = Helper.getClient({ user, password, number })
    if (err !== null) {
        return res.status(code || 500).json({ message: err })
    }

    // get client end
    console.log(`get client end`)
    const { message, numbers } = req.body

    for (let i = 0; i < numbers.length; i++) {
        const num = `${numbers[i]}@c.us`;

        let numberRegisteredWA = await client.isRegisteredUser(num)
        if (numberRegisteredWA) {
            client.sendMessage(num, message)
        }
    }
    res.status(200).json({
        number: client.sessionData.number,
        message: `send-message called`
    });
}