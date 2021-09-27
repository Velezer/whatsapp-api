const { UserModel } = require('../../model/user')
const { ContactsModel } = require('../../model/contacts')

module.exports = async (req, res, next) => {
    console.log(`show-contact`)

    const { user, password, number } = req.body

    const userData = await UserModel.findOne({ user, password, number })
    if (!userData) {
        const err = new Error(`user not found`)
        err.code = 404
        next(err)
    }

    const ContactsData = await ContactsModel.findOne({ _id: userData.contacts_id })


    res.status(200).json({
        user,
        message: `success`,
        data: ContactsData.contacts
    });
}