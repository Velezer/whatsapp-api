class Handler {}

Handler.sendMessage = (req, res) => require('./waweb/send-message')(req, res)
Handler.sendMedia = (req, res) => require('./waweb/send-media')(req, res)
Handler.getContacts = (req, res) => require('./waweb/get-contacts')(req, res)

Handler.user.create=(req,res)=>require('./user/create')(req,res)
Handler.user.pushContact=(req,res)=>require('./user/push-contact')(req,res)


module.exports = Handler