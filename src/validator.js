const { body } = require('express-validator');

const validateReqSendMessage = [
    body(`number`).isMobilePhone(),
    body(`message`).notEmpty()
]
const validateReqSendMessages = [
    body(`numbers`).notEmpty().isString().toArray(),
    body(`numbers`).notEmpty().isArray({min:1}),
    body(`numbers.*`).isMobilePhone(),
    body(`message`).notEmpty()
]


module.exports = { validateReqSendMessage , validateReqSendMessages }