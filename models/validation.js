var mongoose = require('mongoose');

var validationSchema = mongoose.Schema({
    email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});

var Validation = mongoose.model('Validation', validationSchema);

module.exports = validationSchema;