
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
    await ContactsModel.pushContact(userData.contacts, { c_name, c_number })
        .then(() => res.status(200).json({
            message: `successfully added contact ${c_name} ${c_number}`,
        }))
        .catch(err => next(err))

}