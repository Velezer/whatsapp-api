const { validationResult } = require('express-validator');
const { UserModel } = require('../../model/user')
const { SessionModel } = require('../../model/session')

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

    const userData = new UserModel({ user, password, number, contacts: [] })
    let resultUser = null
    let code = null

    try {
        resultUser = await userData.save()
    } catch (err) {
        console.log(`____________${err}`)
        if (err.name == 'ValidationError' || err.code == 11000) { code = 400 }//validation error n duplication error
        else { code = 500 }
        res.status(code).json({
            message: err.message,
        });
    }

    const sessionData = new SessionModel({ user_id: resultUser._id, session: {} })

    let resultSession = null
    try {
        resultSession = await sessionData.save()
    } catch (err) {
        console.log(`____________${err}`)
        if (err.name == 'ValidationError' || err.code == 11000) { code = 400 }//validation error n duplication error
        else { code = 500 }
        res.status(code).json({
            message: err.message,
        });
    }


    res.status(201).json({
        message: `successfully created user`,
        user: {
            user_id: resultSession.user_id,
            user: resultUser.user,
            number: resultUser.number
        }
    });
}