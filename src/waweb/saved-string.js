const sstring={}
sstring.activation_success = `
activation success
___
///activate {your_id}
___
///deactivate
___
///send_media
{caption}
___
///send_message
{message}
___
///add_receivers
{num1}
{num2}
...
___
///empty_receivers
___
///get_contacts

example:
///send_message
your message`

module.exports = sstring