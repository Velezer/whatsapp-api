
module.exports = async (req, res, next) => {
    console.log(`push-contact`)

    const { user, password, number } = req.body
    
    const { UserModel, ContactsModel } = req.db
    
    const userData = await UserModel.findOne({ user, password, number })
    if (!userData) {
        const err = new Error(`user not found`)
        err.code = 404
        next(err)
    }

    const { c_name, c_number } = req.body
    const result = await ContactsModel.deleteContact(userData.contacts_id, { c_name, c_number })

    res.status(200).json({
        user,
        message: `successfully deleted contact ${c_name} ${c_number}`,
        data: result
    });
}