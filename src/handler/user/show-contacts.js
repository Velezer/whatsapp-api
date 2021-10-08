
module.exports = async (req, res, next) => {
    const { user, password, number } = req.body

    const { UserModel } = req.db

    const userData = await UserModel.findOne({ user, number }).populate('contacts')
    if (userData === null) {
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

    res.status(200).json({
        user,
        message: `success`,
        data: userData.contacts
    });
}