const { validationResult } = require('express-validator');
const { UserModel } = require('../../model/user')

module.exports = async (req, res) => {
    console.log(`user-create`)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // validation end

    const { user, password, number } = req.body
    if (await UserModel.findOne({ number })) {
        res.status(400).json({ message: `user with number ${number} is already exist` });
    }
    const userData = new UserModel({ user, password, number, contacts: [] })
    let result = null
    let code = null

    try {
        result = await userData.save()
    } catch (err) {
        console.log(`____________${err}`)
        if (err.name == 'ValidationError' || err.code == 11000) { code = 400 }//validation error n duplication error
        else { code = 500 }
        res.status(code).json({
            message: err.message,
        });
    }


    res.status(201).json({
        message: `successfully created user:${result.user} and number:${result.number}`,
    });
}