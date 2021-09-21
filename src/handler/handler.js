class Handler { }

Handler.waweb = {}
Handler.waweb.sendMessage = require('./waweb/send-message')
Handler.waweb.sendMedia = require('./waweb/send-media')
Handler.waweb.getContacts = require('./waweb/get-contacts')


Handler.user = {}
Handler.user.create = require('./user/create')
Handler.user.delete = require('./user/delete')
Handler.user.pushContact = require('./user/push-contact')
Handler.user.deleteContact = require('./user/delete-contact')
Handler.user.showContacts = require('./user/show-contacts')


module.exports = Handler