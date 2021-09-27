const router = require("express").Router()
const Handler = require('../handler/handler').user
const { Validator } = require('../validation/validator')

router.post('/', Validator.user.common, Handler.create)
router.delete('/', Validator.user.common, Handler.delete)
router.put('/contacts', Validator.user.contact, Handler.pushContact)
router.delete('/contacts', Validator.user.contact, Handler.deleteContact)
router.get('/contacts', Validator.user.common, Handler.showContacts)


module.exports = router