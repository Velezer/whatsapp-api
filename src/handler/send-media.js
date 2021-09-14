const { validationResult } = require('express-validator');
const { Helper } = require('../helper')
const { ImageFileuploadValidationResult } = require('../validation/validator')


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

    const { _id, caption, numbers } = req.body

    const file = req.files.file

    const { client, err } = Helper.getClient(_id)
    if (client == null) {
        return res.status(500).json({ message: err })
    }

    for (let i = 0; i < numbers.length; i++) {
        const num = `${numbers[i]}@c.us`;

        let numberRegisteredWA = await client.isRegisteredUser(num)
        if (numberRegisteredWA) {
            client.sendMedia(num, file, caption)
        }
    }
    res.status(200).json({
        _id: client._id,
        message: `send-media called`
    });
}