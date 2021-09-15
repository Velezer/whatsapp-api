const { validationResult } = require('express-validator');
const { Helper } = require('./helper')


module.exports = async (req, res) => {
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
        found: contacts.length,
        message: `get-contacts called`,
        contacts: contacts,
    });
}