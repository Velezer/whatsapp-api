const { Helper } = require('./helper')


module.exports = async (req, res, next) => {
    console.log(`getContacts`)

    const { user, password, number } = req.body

    const data = await Helper.getClient({ user, password, number })
    console.log(`code:`, data.code)
    if (data.err) {
        next(data.err)
    }
    const client = data.client
    // get client end

    const contacts = await client.getContacts()

    res.status(200).json({
        number: client.userData.number,
        found: contacts.length,
        message: `get-contacts called`,
        contacts: contacts,
    });
}