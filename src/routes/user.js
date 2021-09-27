const router = require("express").Router()
const Handler = require('../handler/handler')
const { Validator } = require('../validation/validator')

router.post('/api/user', Validator.user.common, Handler.user.create)
router.post('/api/user', Validator.user.common, Handler.user.delete)
router.put('/api/user/contacts', Validator.user.contact, Handler.user.pushContact)
router.delete('/api/user/contacts', Validator.user.contact, Handler.user.deleteContact)
router.get('/api/user/contacts', Validator.user.common, Handler.user.showContacts)


module.exports = router