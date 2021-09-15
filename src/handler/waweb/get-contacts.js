const { validationResult } = require('express-validator');
const { Helper } = require('./helper')


module.exports = async (req, res) => {
    console.log(`getContacts`)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // validation end

    const { user, password, number } = req.body

    const { client, err } = Helper.getClient({ user, password, number })
    if (client == null) {
        return res.status(500).json({ message: err })
    }
    // get client end

    const contacts = await client.getContacts()

    res.status(200).json({
        number: client.sessionData.number,
        found: contacts.length,
        message: `get-contacts called`,
        contacts: contacts,
    });
}