const { validationResult } = require('express-validator');
const { UserModel } = require('../../model/user')

module.exports = async (req, res) => {
    console.log(`show-contact`)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // validation end

    const { user, password, number } = req.body

    const userData = await UserModel.findOne({ user, password, number })


    res.status(200).json({
        user,
        message: `success`,
        contacts: userData.contacts
    });
}