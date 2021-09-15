const { validationResult } = require('express-validator');
const { UserModel } = require('../../model/user')

module.exports = async (req, res) => {
    console.log(`user-create`)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // validation end

    const { user, password } = req.body

    const userData = new UserModel({ user, password, contacts: [] })
    let result = null

    try {
        result = await userData.save()
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }


    res.status(201).json({
        user,
        message: `successfully created`,
        result: result
    });
}