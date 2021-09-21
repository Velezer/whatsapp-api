const { UserModel } = require('../../model/user')
const { ContactsModel } = require('../../model/contacts')

module.exports = async (req, res) => {
    console.log(`show-contact`)


    const { user, password, number } = req.body

    const userData = await UserModel.findOne({ user, password, number })

    const ContactsData = await ContactsModel.findOne({ _id:userData.contacts_id })


    res.status(200).json({
        user,
        message: `success`,
        contacts: ContactsData.contacts
    });
}