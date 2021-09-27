const router = require("express").Router()
const Handler = require('../handler/handler')
const { Validator } = require('../validation/validator')

router.post('/api/waweb/send-message', Validator.waweb.sendMessage, Handler.waweb.sendMessage)
router.post('/api/waweb/send-media', Validator.waweb.sendMedia, Handler.waweb.sendMedia)
router.post('/api/waweb/get-contacts', Validator.user.common, Handler.waweb.getContacts)


module.exports = router