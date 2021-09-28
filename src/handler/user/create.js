
module.exports = async (req, res, next) => {
    console.log(`user-create`)
    console.log(req.env)

    const { user, password, number } = req.body

    const { UserModel } = req.db
    // manual unique
    if (await UserModel.findOne({ number })) {
        const err = new Error(`user with number ${number} is already exist`)
        err.code = 400
        next(err)
    }
    // manual unique end

    const bcrypt = req.bcrypt
    // eslint-disable-next-line no-undef
    bcrypt.hash(password, Number(process.env.SALT_OR_ROUNDS))
        .then(async (password) => {

            const resultUser = await UserModel.createUser({ user, password, number })
            res.status(201).json({
                message: `successfully created user`,
                data: {
                    user: resultUser.user,
                    number: resultUser.number
                }
            });

        })
        .catch(err => next(err))
}