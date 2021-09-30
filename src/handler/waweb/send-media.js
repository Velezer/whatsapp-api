

module.exports = async (req, res) => {
    console.log(`sendMedia`)

    const client = req.client

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
        message: `send-media called`
    });
}