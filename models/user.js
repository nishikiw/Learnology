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
		required: true,
		'default': shortid.generate
	},
	admin: {
		type: Boolean,
		'default': true
	},
	flagged: {
		type: Boolean,
		'default': false
	},
	first_name: String,
	last_name: String,
	gender: String,
	date_of_birth: Date,
	phone: Number,
	address: {
		street: String,
		city: String,
		province: String,
		Country: String
	}，
	favorites: {
		categories: [String],
		teachers: [String]
	}
});

var User = mongoose.model('User', userSchema);

module.exports = User;
