

module.exports = async (req, res) => {
    console.log(`getContacts`)
    
    const client = req.client

    const contacts = await client.getContacts()

    res.status(200).json({
        number: client.userData.number,
        found: contacts.length,
        message: `get-contacts called`,
        contacts: contacts,
    });
}