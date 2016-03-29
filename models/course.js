var mongoose = require('mongoose');
var shortid = require('shortid');

var courseSchema = mongoose.Schema({
	user: {type: String, required: true},
	_id: {type: String, unique: true, 'default': shortid.generate},
	title: {type: String, required: true},
	location: {type: String, required: true, default: 'online'},
	category: {type: String, required: true},
	price: {type: String, required: true},
	description: {type: String, required: true},
	skills: {type: String},
	difficulty: {type: String, required: true},
	comments: [{ rating: Number, heading: String, body: String, user: String}],
	votes: { type: Number, default: 0},
	flagged: { type: Boolean, default: false }
});

var Course = mongoose.model('Course', courseSchema);

module.exports = Course;
