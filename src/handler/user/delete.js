const { UserModel } = require('../../model/user')

module.exports = async (req, res, next) => {
    console.log(`user-delete`)


    const { user, password, number } = req.body

    const found = await UserModel.findOne({ number })
    if (!found) {
        const err = new Error(`user with number ${number} not found`)
        err.code = 404
        next(err)
    }

    await UserModel.deleteOne({ user, password, number })


    res.status(200).json({
        message: `successfully deleted user`,
    });
}