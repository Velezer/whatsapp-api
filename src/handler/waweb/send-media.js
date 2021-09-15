const { validationResult } = require('express-validator');
const { Helper } = require('./helper')
const { ImageFileuploadValidationResult } = require('../../validation/validator')


module.exports = async (req, res) => {
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

    
    const { user, password, number } = req.body

    const { client, err } = Helper.getClient({ user, password, number })
    if (client == null) {
        return res.status(500).json({ message: err })
    }
    // get client end

    const { caption, numbers } = req.body

    const file = req.files.file
    for (let i = 0; i < numbers.length; i++) {
        const num = `${numbers[i]}@c.us`;

        let numberRegisteredWA = await client.isRegisteredUser(num)
        if (numberRegisteredWA) {
            client.sendMedia(num, file, caption)
        }
    }
    res.status(200).json({
        number: client.sessionData.number,
        message: `send-media called`
    });
}