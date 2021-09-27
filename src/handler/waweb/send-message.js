const { Helper } = require('./helper')


module.exports = async (req, res, next) => {
    console.log(`sendMessage`)

    const { user, password, number } = req.body

    const data = await Helper.getClient({ user, password, number })
    console.log(`code:`, data.code)
    if (data.err) {
        next(data.err)
    }
    const client = data.client
    console.log(`get client end`)
    // get client end
    const { message, numbers } = req.body

    for (let i = 0; i < numbers.length; i++) {
        const num = `${numbers[i]}@c.us`;

        let numberRegisteredWA = await client.isRegisteredUser(num)
        if (numberRegisteredWA) {
            client.sendMessage(num, message)
        }
    }
    res.status(200).json({
        number: client.userData.number,
        message: `send-message called`
    });
}