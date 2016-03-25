var mongoose = require('mongoose');
var shortid = require('shortid');

var courseSchema = mongoose.Schema({
    user: {type: String, required: true},
    _id: {type: String, unique: true, 'default': shortid.generate},
    title: {type: String, required: true},
	category: {type: String, required: true},
	price: {type: Number, required: true},
	description: {type: String, required: true},
	skills: [{ skill: String }],
	difficulty: {type: String, required: true},
	comments: [{ body: String, user: String}],
	votes: { type: Number, default: 0},
	ratings: [{ rating: Number }],
	flagged: { type: Boolean, default: false }
});

var Course = mongoose.model('Course', courseSchema);

module.exports = Course;
