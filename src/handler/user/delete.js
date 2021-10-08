
module.exports = async (req, res, next) => {
    const { user, password, number } = req.body

    const { UserModel } = req.db

    const found = await UserModel.findOne({ number })
    if (!found) {
        const err = new Error(`user with number ${number} not found`)
        err.code = 404
        return next(err)
    }

    const bcrypt = req.bcrypt
    const match = await bcrypt.compare(password, found.password)
    if (!match) {
        const err = new Error(`password doesn't match`)
        err.code = 400
        return next(err)
    }
    
    await UserModel.deleteOne({ user, number })
        .then(() => res.status(200).json({
            message: `successfully deleted user`,
        }))
        .catch(err => next(err))

}