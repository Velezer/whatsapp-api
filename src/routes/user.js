const router = require("express").Router()
const Handler = require('../handler/handler')
const { Validator } = require('../validation/validator')

router.post('/', Validator.user.common, Handler.user.create)
router.delete('/', Validator.user.common, Handler.user.delete)
router.put('/contacts', Validator.user.contact, Handler.user.pushContact)
router.delete('/contacts', Validator.user.contact, Handler.user.deleteContact)
router.get('/contacts', Validator.user.common, Handler.user.showContacts)


module.exports = router