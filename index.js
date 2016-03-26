// mongoose-bcrypt reference: https://www.npmjs.com/package/mongoose-bcrypt

var express = require('express');
var app = express();
var fs = require("fs");
var path = require("path");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var Course = require('./models/course.js');
var Validation = require('./models/validation.js');
var session = require('./node_modules/sesh/lib/core').magicSession();

mongoose.connect('mongodb://localhost:27017/learnology');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Connected to mongodb...");
});

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'html');

app.use('/', express.static(__dirname + '/public'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// Create application/x-www-form-urlencoded parser
// Reference: http://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm
var urlencodedParser = bodyParser.urlencoded({extended: true})

app.get('/aboutus', function(req, res) {
  res.sendFile(__dirname + '/public/aboutus.html');
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/categories', function(req, res) {
  res.sendFile(__dirname + '/public/categories.html');
});

app.get('/course', function(req, res) {
  res.sendFile(__dirname + '/public/course.html');
});

app.get('/coursecreation', function(req, res) {
  res.sendFile(__dirname + '/public/coursecreation.html');
});

app.get('/profile', function(req, res) {
  res.sendFile(__dirname + '/public/profile.html');
});

app.get('/search', function(req, res) {
  res.sendFile(__dirname + '/public/search.html');
});

app.get('/edit-profile', function(req, res) {
  res.sendFile(__dirname + '/public/edit-profile.html');
});

app.get('/getlogin', function(req, res){
	res.end(req.session.data.user);
});

app.get('/logout', function(req, res){
	req.session.data.user = "Guest";
    res.redirect('back');
});

app.get('/users', function(req, res){
	User.find(function (err, users) {
		if (err) return console.error(err);
		res.send(users);
	});
});

app.get('/courses', function(req, res){
	Course.find({}, {"title":1, _id:1}, function (err, courses) {
		if (err) return console.error(err);
		res.send(courses);
	});
});

app.post('/delete/user', urlencodedParser, function(req, res){
	User.remove({'username': req.body.username}, function (err) {
		if (err) return console.error(err);
		res.send('done');
	});
});

app.post('/delete/course', urlencodedParser, function(req, res){
	Course.remove({'title': req.body.title}, function (err) {
		if (err) return console.error(err);
		res.send('done');
	});
});

app.get('/users/user', function(req, res){	
	User.findOne({'email': req.query.email}, function (err, user) {
		if (err) return handleError(err);
		if (user){
			console.log(user);
			res.end(JSON.stringify(user));
		}
		else{
			res.end("{}");
		}
	});
});

app.post('/users/user', urlencodedParser, function(req, res){
	var screenName = req.body.screenName;
	var email = req.body.email;
	var password = req.body.password;
	
	if (screenName == ""){
		screenName = null;
	}
	
	var userObj = {
		email: email,
		screen_name: screenName
	};
	
	var validationObj = {
		email: email,
		password: password
	}
	
	Validation.create(validationObj, function (err) {
		if (err) return console.error(err);
	});
	
	User.create(userObj, function (err) {
		if (err) return console.error(err);
	});
	
	User.find(function (err, users) {
		if (err) return console.error(err);
		console.log(users);
	});
	
	Validation.find(function (err, users) {
		if (err) return console.error(err);
		console.log(users);
	});

	req.session.data.user = email;
	res.redirect('/edit-profile/' + req.body.screenName);
});

app.post('/create', urlencodedParser, function(req, res){
	// Prepare output in JSON format
	courseObj = {
		user: req.session.data.user,
	    title: req.body.title,
		category: req.body.category,
		price: req.body.price,
		description: req.body.description,
		skills: req.body.skills,
		difficulty: req.body.difficulty
	};
	
	var course = new Course(courseObj);
	
	course.save(function (err, data) {
		if (err) console.log(err);
		else console.log('Saved : ', data );
	});
	
	Course.find(function (err, courses) {
		if (err) return console.error(err);
		console.log(courses);
	});

	res.redirect('course/' + courseObj._id);
});

app.post('/login', urlencodedParser, function(req, res){
  if(typeof req.body.username != 'undefined'){
    req.session.data.user = req.body.username; 
  }
  res.send(req.session.data.user);
});
