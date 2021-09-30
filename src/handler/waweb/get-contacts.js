

module.exports = async (req, res) => {
    const client = req.client

    const contacts = await client.getContacts()

    res.status(200).json({
        found: contacts.length,
        message: `get-contacts called`,
        contacts: contacts,
    });
}