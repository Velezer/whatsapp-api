const { body } = require('express-validator');

const validateReqSendMessage = [
    body(`number`).isMobilePhone(),
    body(`message`).notEmpty()
]
const validateReqSendMessages = [
    body(`numbers.*`).isMobilePhone(),
    body(`message`).notEmpty()
]


module.exports = { validateReqSendMessage , validateReqSendMessages }