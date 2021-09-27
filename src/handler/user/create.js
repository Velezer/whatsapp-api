const { UserModel } = require('../../model/user')

module.exports = async (req, res, next) => {
    console.log(`user-create`)

    const { user, password, number } = req.body

    // manual unique
    if (await UserModel.findOne({ number })) {
        const err = new Error(`user with number ${number} is already exist`)
        err.code = 400
        next(err)
    }
    // manual unique end


    const resultUser = await UserModel.createUser({ user, password, number })


    res.status(201).json({
        message: `successfully created user`,
        data: {
            user: resultUser.user,
            number: resultUser.number
        }
    });
}