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

    const { _id } = await UserModel.findOne({ user, password })

    const { name, number } = req.body
    const result = await UserModel.pushContact(_id, { name, number })

    res.status(200).json({
        user,
        message: `successfully added contact ${name} ${number}`,
        result: result
    });
}