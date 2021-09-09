const { body } = require('express-validator');

const validateReqSendMessage = [
    body(`number`).isMobilePhone(),
    body(`message`).notEmpty()
]
const validateReqSendMessages = [
    body(`numbers`,`can't convert string to array`).toArray(),
    body(`numbers`, `array min length is 1`).notEmpty().isArray({min:1}),
    body(`numbers.*`,`not a mobile phone`).isMobilePhone(),
    body(`message`).notEmpty()
]


module.exports = { validateReqSendMessage , validateReqSendMessages }