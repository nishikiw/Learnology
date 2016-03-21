var express = require('express');
var app = express();
var fs = require("fs");
var path = require("path");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user.js');

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Connected to mongodb...");
});

app.use('/', express.static(__dirname + '/public'));

// Create application/x-www-form-urlencoded parser
// Reference: http://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm
var urlencodedParser = bodyParser.urlencoded({extended: false})

app.post('/users/user', urlencodedParser, function(req, res){
	// Prepare output in JSON format
	userObj = {
		username: req.body.username, 
		password: req.body.password,
		email: req.body.email
	};
	
	var user = new User(userObj);
	
	user.save(function (err, data) {
		if (err) console.log(err);
		else console.log('Saved : ', data );
	});
	
	User.find(function (err, users) {
		if (err) return console.error(err);
		console.log(users);
	})
	
	res.end(JSON.stringify(userObj));
})

var server = app.listen(3000, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://%s:%s", host, port)
})