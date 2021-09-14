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

    let contacts = await client.getContacts()
    contacts.forEach(contact => {
        const keys = Object.keys(contact)
        keys.forEach(key => {
            if (key !== `number` &&
                key !== `name` &&
                key !== `pushname` &&
                key !== `shortName` &&
                key !== `verifiedName`) {
                delete contact[key] // delete unused property
            }
        });
    })
    contacts = contacts.filter(contact => contact.number !== null)

    res.status(200).json({
        _id: client._id,
        contacts: contacts,
        message: `get-contacts called`
    });
}