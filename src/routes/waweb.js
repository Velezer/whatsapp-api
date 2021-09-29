const router = require("express").Router()
const Handler = require('../handler/handler').waweb
const { Validator } = require('../validation/validator')

// routes for /api/waweb
router.post('/send-message', Validator.waweb.sendMessage, Handler.getClientMiddleware, Handler.sendMessage)
router.post('/send-media', Validator.waweb.sendMedia, Handler.getClientMiddleware, Handler.sendMedia)
router.post('/get-contacts', Validator.user.common, Handler.getClientMiddleware, Handler.getContacts)


module.exports = router