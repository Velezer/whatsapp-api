
module.exports = async (req, res, next) => {
    const { user, password, number } = req.body

    const { UserModel, ContactsModel } = req.db

    const userData = await UserModel.findOne({ user, password, number })
    if (!userData) {
        const err = new Error(`user not found`)
        err.code = 404
        return next(err)
    }

    const { c_name, c_number } = req.body
    await ContactsModel.pushContact(userData.contacts, { c_name, c_number })
        .then(result => res.status(200).json({
            user,
            message: `successfully added contact ${c_name} ${c_number}`,
            data: result
        }))
        .catch(err => next(err))

}