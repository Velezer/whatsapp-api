const { UserModel } = require('../../model/user')

module.exports = async (req, res) => {
    console.log(`user-create`)

    const { user, password, number } = req.body

    // manual unique start
    if (await UserModel.findOne({ number })) {
        return res.status(400).json({ message: `user with number ${number} is already exist` });
    }
    // manual unique end


    const resultUser = await UserModel.createUser({ user, password, number })


    res.status(201).json({
        message: `successfully created user`,
        user: {
            user: resultUser.user,
            number: resultUser.number
        }
    });
}