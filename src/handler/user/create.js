const { validationResult } = require('express-validator');
const { UserModel } = require('../../model/user')

module.exports = async (req, res) => {
    console.log(`insertContacts`)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // validation end

    const { user, password } = req.body

    const result = await UserModel.insertOne({ user, password })

    res.status(201).json({
        user,
        message: `successfully created`,
        result: result
    });
}