const { body } = require('express-validator');
const { ExpressFileuploadValidator } = require('express-fileupload-validator');



class ImageFileuploadValidationResult extends ExpressFileuploadValidator {
    constructor(req) {
        super({
            minCount: 1,
            maxCount: 1,
            allowedExtensions: ['jpg', 'png', 'gif'],
            allowedMimetypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'],
            maxSize: '10MB',
        })
        try {
            this.validate(req.files.file);
        } catch (e) {
            if (req.files == null) this.errors = { file: `no file uploaded` }
            else this.errors = { file: e.errors }
        }
    }
    isEmpty() {
        return (this.errors === {} || this.errors === [] || this.errors === `` || this.errors === undefined || this.errors === null)
    }
    array() {
        return this.errors
    }

}



const validateReqSendMessages = [
    body(`numbers`, `numbers is empty`).notEmpty(),
    body(`numbers`, `can't convert to array`).toArray(),
    body(`numbers`, `numbers array min length is 1`).isArray({ min: 1 }),
    body(`numbers.*`, `not a mobile phone`).isMobilePhone(),

    body(`message`, `message is empty`).notEmpty(),
    body(`_id`, `_id is empty`).notEmpty(),
    body(`_id`, `_id is not string`).isString()
]
const validateReqSendMedia = [
    body(`numbers`, `numbers is empty`).notEmpty(),
    body(`numbers`, `can't convert to array`).toArray(),
    body(`numbers`, `numbers array min length is 1`).isArray({ min: 1 }),
    body(`numbers.*`, `not a mobile phone`).isMobilePhone(),

    body(`caption`, `caption is empty`).notEmpty(),
    body(`_id`, `_id is empty`).notEmpty(),
    body(`_id`, `_id is not string`).isString()
]

const validateGetContacts = [
    body(`_id`, `_id is empty`).notEmpty(),
    body(`_id`, `_id is not string`).isString()
]


module.exports = { validateReqSendMessages, validateReqSendMedia, ImageFileuploadValidationResult, validateGetContacts }