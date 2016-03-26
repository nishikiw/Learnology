// mongoose-bcrypt reference: https://www.npmjs.com/package/mongoose-bcrypt

var mongoose = require('mongoose');

var validationSchema = mongoose.Schema({
    email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		bcrypt: true
	}
});

validationSchema.plugin(require('mongoose-bcrypt'));

var Validation = mongoose.model('Validation', validationSchema);

module.exports = Validation;