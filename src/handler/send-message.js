const { validationResult } = require('express-validator');
const { Helper } = require('../helper')


module.exports = async (req, res) => {
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