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
var multer  = require('multer');

var upload = multer({dest: './public/images/profile/'}).single('file');

mongoose.connect('mongodb://localhost:27017/learnology');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('Node app is running on port', app.get('port'));
	console.log("Connected to mongodb...");
});

app.set('port', (process.env.PORT || 5000));


app.use('/', express.static(__dirname + '/public'));
app.set('view engine', 'html');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// Create application/x-www-form-urlencoded parser
// Reference: http://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm
var urlencodedParser = bodyParser.urlencoded({extended: true})

app.post('/images', function (req, res) {
	upload(req, res, function (err) {
		if (err) {
			console.log("Upload error");
			return
		}
		var ext = req.file.mimetype.split("/")[1];
		var oldPath = req.file.path;
		var newPath = oldPath + "." + ext;
		var filename = req.file.filename + "." + ext;
		fs.rename(oldPath, newPath, function (err) {
			if (err) {
				console.log("Rename error");
				return
			}
			
			// Update user image src in database.
			User.findOne({ screen_name: req.session.data.user }, function (err, userInfo){
				if (err) return console.error(err);
				userInfo.image_name = filename;
				userInfo.save();
				res.json(userInfo);
			});
		});
	})
})

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

app.post('/search/res', urlencodedParser, function(req, res) {
    // Attack concepts from http://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html
    //console.log(req.body.searchBy +" " + req.body.terms );
    var terms = req.body.terms.toString(10); //Make sure it's a string
    // From http://stackoverflow.com/questions/13283470/regex-for-allowing-alphanumeric-and-space
    var regex = new RegExp("^[a-z\d\\-_\s]+$", "i"); // Allow alphanumeric characters, spaces, hyphens, underscores
    
    if(!regex.test(terms)){
        res.send([]);
        return
    }
    
    if (req.body.searchBy == "Keywords") {
        Course.find({'title': new RegExp('^.*?'+terms+'.*?$', "i")}, function(err, courses) {
            //for (var i = 0; i < courses.length; i++) {
                //var course = courses[i];
                //console.log(course.title);
                //console.log(course.user);
                //console.log(course.rating);
                //console.log(course.difficulty);
                //console.log(course.description);
            //}
            res.send(courses);
        });
    } else if (req.body.searchBy == "Teacher+Name") {
        Course.find({ 'user': new RegExp(terms, "i")}, function(err, courses) {
            res.send(courses);
        });
    } else if (req.body.searchBy == "Category") {
        Course.find({ 'category': new RegExp(terms, "i")}, function(err, courses) {
            res.send(courses);
        });
    } else {
        res.send([]);
    }
    
});

app.get('/edit-profile', function(req, res) {
  res.sendFile(__dirname + '/public/edit-profile.html');
});

app.get('/admin', function(req, res) {
  res.sendFile(__dirname + '/public/admin.html');
});

app.get('/getlogin', function(req, res){
	res.end(req.session.data.user);
});

app.get('/logout', function(req, res){
	req.session.data.user = "Guest";
    res.redirect('back');
});

app.get('/users', function(req, res){
	User.find({}, {}, function (err, users) {
		if (err) return console.error(err);
		res.send(users);
	});
});

app.get('/users/flagged', function(req, res){
	User.find({"flagged" : true}, {}, function (err, users) {
		if (err) return console.error(err);
		res.send(users);
	});
});

app.post('/search/one', urlencodedParser, function(req, res){
	if (req.body.type == 'user') {
		User.find({"screen_name" : {$regex : ".*"+req.body.screen_name+".*"}}, {}, function (err, users) {
			if (err) return console.error(err);
			res.send(users);
		});
	}
	else {
		Course.find({"_id" : req.body.id}, {}, function (err, courses) {
		if (err) return console.error(err);
			res.send(courses);
		});
	}
});

app.get('/courses', function(req, res){
	Course.find({}, {}, function (err, courses) {
		if (err) return console.error(err);
		res.send(courses);
	});
});

app.get('/courses/flagged', function(req, res){
	Course.find({"flagged" : true}, {}, function (err, courses) {
		if (err) return console.error(err);
		res.send(courses);
	});
});

app.post('/delete/user', urlencodedParser, function(req, res){
	User.remove({'screen_name': req.body.screen_name}, function (err) {
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
	if (req.query.email){
		Validation.findOne({'email': req.query.email}, function (err, user) {
			if (err) return handleError(err);
			if (user){
				var userInfo = {
					email: user.email
				}
				res.end(JSON.stringify(userInfo));
			}
			else{
				res.end("{}");
			}
		});
	}
	else if (req.query.screenName){
		if (req.query.screenName == req.session.data.user){
			User.findOne({'screen_name': req.query.screenName}, function (err, user) {
				if (err) return handleError(err);
				if (user){
					res.end(JSON.stringify(user));
				}
				else{
					res.end("{}");
				}
			});
		}
		else{
			res.end("{}");
		}
	}
});

app.post('/users/user', urlencodedParser, function(req, res){
	var screenName = req.body.screenName;
	var email = req.body.email;
	var password = req.body.password;
	var userObj, user, msg;
	
	if (req.body.login){
		// Login authentication.
		Validation.findOne({'email': email}, function (err, user) {
			if (err) return handleError(err);
			if (user){
				user.verifyPassword(password, function(err, valid) {
					if (err) return handleError(err);
					if (valid){
						User.findOne({'email': email}, function(err, userInfo){
							if (err) return handleError(err);
							if (userInfo){
								req.session.data.user = userInfo.screen_name; 
								msg = {
									msg: "success"
								};
								res.end(JSON.stringify(msg));
							}
						});
					}
					else{
						msg = {
							msg: "passwordIncorrect"
						};
						res.end(JSON.stringify(msg));
					}
				});
			}
			else{
				msg = {
					msg: "emailNotExist"
				};
				res.end(JSON.stringify(msg));
			}
		});
	}
	else{
		// Sign up.
		if (screenName == ""){
			userObj = {
				email: email,
			};
		}
		else{
			userObj = {
				email: email,
				screen_name: screenName
			};
		}

		var validationObj = {
			email: email,
			password: password
		}
	
		Validation.create(validationObj, function (err) {
			if (err) return console.error(err);
		});
	
		var user = new User(userObj);
		user.save(function (err, user) {
			if (err) return console.error(err);
			req.session.data.user = user.screen_name;
			res.redirect('/edit-profile?screen-name=' + user.screen_name);
		});
	}
});

app.post('/create', urlencodedParser, function(req, res){
	// Prepare output in JSON format
	courseObj = {
		user: req.session.data.user,
	    title: req.body.title,
	    location: req.body.location,
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

	res.redirect('/course?id=' + courseObj._id);
});