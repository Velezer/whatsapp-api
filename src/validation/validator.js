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

class Validator { }

Validator.waweb = {}
Validator.waweb.sendMessage = [
    ...Rules.numbers,
    ...Rules.message,
    ...Rules.user,
]
Validator.waweb.sendMedia = [
    ...Rules.numbers,
    ...Rules.caption,
    ...Rules.user,
]

Validator.user = {}
Validator.user.common = [
    ...Rules.user,
]
Validator.user.contact = [
    ...Rules.user,
    ...Rules.contact
]




module.exports = { Validator, ImageFileuploadValidationResult }