var mongoose = require('mongoose');
var shortid = require('shortid');

var userSchema = mongoose.Schema({
    email: {
		type: String,
		required: true,
		unique: true
	},
	screen_name: {
		type: String,
		unique: true,
		'default': shortid.generate
	}
});

var User = mongoose.model('User', userSchema);

module.exports = User;