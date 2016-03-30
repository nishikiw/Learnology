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
	phone: {
		number: String,
		is_public: {
			type: Boolean,
			'default': false
		}
	},
	address: {
		street: String,
		city: String,
		province: String,
		country: String
	},
	favorites: {
		categories: [String],
		teachers: [String]
	},
	image_name: String,
	description: String,
	courses_taken: [String],
	courses_created: [String],
	contact_email: {
		type: String,
		required: true
	},
	title: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;
