const { validationResult } = require('express-validator');
const { UserModel } = require('../../model/user')
// const { SessionModel } = require('../../model/session')
// const { ContactsModel } = require('../../model/contacts')

module.exports = async (req, res) => {
    console.log(`user-create`)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // validation end

    const { user, password, number } = req.body

    // manual unique start
    if (await UserModel.findOne({ number })) {
        res.status(400).json({ message: `user with number ${number} is already exist` });
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