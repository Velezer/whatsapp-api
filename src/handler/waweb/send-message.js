

module.exports = async (req, res) => {
    console.log(`sendMessage`)

    const client = req.client

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