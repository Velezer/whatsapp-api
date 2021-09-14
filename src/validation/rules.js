const { body } = require('express-validator');


class Rules { }
Rules.numbers = [
    body(`numbers`, `numbers is empty`).notEmpty(),
    body(`numbers`, `can't convert to array`).toArray(),
    body(`numbers`, `numbers array min length is 1`).isArray({ min: 1 }),
    body(`numbers.*`, `not a mobile phone`).isMobilePhone(),
];
Rules.message = [
    body(`message`, `message is empty`).notEmpty(),
]
Rules.caption = [
    body(`caption`, `caption is empty`).notEmpty(),
]
Rules._id = [
    body(`_id`, `_id is empty`).notEmpty(),
    body(`_id`, `_id is not string`).isString()
]

module.exports = { Rules }