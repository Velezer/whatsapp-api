const { Helper } = require('./helper')


module.exports = async (req, res, next) => {
    console.log(`sendMedia`)

    const { user, password, number } = req.body

    const data = await Helper.getClient({ user, password, number })
    console.log(`code:`, data.code)
    if (data.err) {
        next(data.err)
    }
    const client = data.client
    // get client end

    const { caption, numbers } = req.body

    const file = req.files.file
    for (let i = 0; i < numbers.length; i++) {
        const num = `${numbers[i]}@c.us`;

        let numberRegisteredWA = await client.isRegisteredUser(num)
        if (numberRegisteredWA) {
            client.sendMedia(num, file, caption)
        }
    }
    res.status(200).json({
        number: client.userData.number,
        message: `send-media called`
    });
}