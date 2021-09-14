const { ExpressFileuploadValidator } = require('express-fileupload-validator');
const { Rules } = require('./rules')


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
    ...Rules.numbers,
    ...Rules.message,
    ...Rules._id
]
const validateReqSendMedia = [
    ...Rules.numbers,
    ...Rules.caption,
    ...Rules._id
]

const validateGetContacts = [
    ...Rules._id
]


module.exports = { validateReqSendMessages, validateReqSendMedia, ImageFileuploadValidationResult, validateGetContacts }