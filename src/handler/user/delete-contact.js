
module.exports = async (req, res, next) => {
    const { user, password, number } = req.body

    const { UserModel, ContactsModel } = req.db

    const userData = await UserModel.findOne({ user, number })
    if (!userData) {
        const err = new Error(`user not found`)
        err.code = 404
        return next(err)
    }

    const bcrypt = req.bcrypt
    const match = await bcrypt.compare(password, userData.password)
    if (!match) {
        const err = new Error(`password doesn't match`)
        err.code = 400
        return next(err)
    }

    const { c_name, c_number } = req.body
    await ContactsModel.deleteContact(userData.contacts_id, { c_name, c_number })
        .then(result => res.status(200).json({
            message: `successfully deleted contact ${c_name} ${c_number}`,
            data: result
        }))
        .catch(err => next(err))

}