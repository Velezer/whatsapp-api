const { body } = require('express-validator');
const { ExpressFileuploadValidator } = require('express-fileupload-validator');



class fileValidationResult {
    constructor(req) {
        const expressFileuploadValidator = new ExpressFileuploadValidator({
            minCount: 0,
            maxCount: 1,
            allowedExtensions: ['jpg', 'png', 'gif'],
            allowedMimetypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'],
            maxSize: '20MB',
        });
        try {
            expressFileuploadValidator.validate(req.files.file);
        } catch (e) {
            this.errors = e.errors
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

    body(`message`, `message is empty`).notEmpty()
]
const validateReqSendMedia = [
    body(`numbers`, `numbers is empty`).notEmpty(),
    body(`numbers`, `can't convert to array`).toArray(),
    body(`numbers`, `numbers array min length is 1`).isArray({ min: 1 }),
    body(`numbers.*`, `not a mobile phone`).isMobilePhone(),

    body(`caption`, `caption is empty`).isString(),
    // body(`file.mimetype`,`file is not an image`).isMimeType('image/*')
]


module.exports = { validateReqSendMessages, validateReqSendMedia, fileValidationResult }