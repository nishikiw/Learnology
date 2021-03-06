var app = angular.module('learnologyApp', []);

// Parsing url
var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};
// Submitting search form and send it to search
function submitform() {  
    document.searchform.submit(); 
} 

// Controller for profile page.
app.controller('profileCtrl', function ($scope, $http){
	//Input an array of course ids, return an array of course objects according to course id.
	$scope.getCourses = function(courseIdArray){
		var courseObjArray = [];
		for (var i=0; i<courseIdArray.length; i++){
			var req = { 
				method: 'POST',
				url: '/search/one',
				data: $.param({type: 'course-id', id : courseIdArray[i]}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			};
			$http(req).then(function successCallback(res){
				var courseInfo = res.data[0];
				if (courseInfo){
					courseObjArray.push(courseInfo);
				}
			}, function errorCallback(res) {
			});
		}
		return courseObjArray;
	}
	
	// Initialize profile page, get user info and session user.
	$scope.initProfile = function(){
		var url = window.location.href;
		var reqScreenName = url.split("=")[1].split("#")[0];
		
		var req = {
			method: 'GET',
			url: 'users/user',
			params: {screenName: reqScreenName, profile: true}
		}
		$http(req).then(function successCallback(res){
			var userInfo = res.data;
			if (userInfo){
				if (userInfo.screen_name){
					$scope.screenName = userInfo.screen_name;
				}
				if (userInfo.gender){
					$scope.gender = userInfo.gender;
				}
				if (userInfo.first_name){
					$scope.firstName = userInfo.first_name;
				}
				if (userInfo.last_name){
					$scope.lastName = userInfo.last_name;
				}
				if (userInfo.contact_email && userInfo.contact_email.is_public && userInfo.contact_email.address){
					$scope.contactEmail = userInfo.contact_email.address;
				}
				if (userInfo.title){
					$scope.title = userInfo.title;
				}
				if (userInfo.phone && userInfo.phone.is_public && userInfo.phone.number){
					$scope.phone = userInfo.phone.number;
				}
				if (userInfo.address){
					if (userInfo.address.city){
						$scope.city = userInfo.address.city;
					}
					if (userInfo.address.province){
						$scope.province = userInfo.address.province;
					}
					if (userInfo.address.country){
						$scope.country = userInfo.address.country;
					}
				}
				if (userInfo.description){
					$scope.description = userInfo.description;
				}
				if (userInfo.image_name){
					$scope.profileImgName = userInfo.image_name;
				}
				else{
					switch ($scope.gender){
						case "female":
							$scope.profileImgName = "female.png";
							break;
						case "male":
						case "others":
						default:
							$scope.profileImgName = "male.png";
					}
				}
				if (userInfo.isOwner){
					$scope.isOwner = userInfo.isOwner;
				}
				// Load courses.
				$scope.coursesAppliedArray = $scope.getCourses(userInfo.courses_applied);
				$scope.coursesTakingArray = $scope.getCourses(userInfo.courses_taking);
				$scope.coursesFinishedArray = $scope.getCourses(userInfo.courses_finished);
				$scope.coursesCreatedArray = $scope.getCourses(userInfo.courses_created);
			}
		}, function errorCallback(res) {
		});
	}
	
	// To cancel description edit and back to original profile page without refreshing the page.
	$scope.cancelDescriptionEdit = function(){
		$scope.descriptionInEdit = false;
		$scope.descriptionTextArea = $scope.description;
	}
	
	// Hide description div and show form to edit description.
	$scope.editDescription = function(){
		$scope.descriptionInEdit = true;
		$scope.descriptionTextArea = $scope.description;
	}
	
	// Submit modified description to the server to update the user database.
	$scope.updateDescription = function(){
		if ($scope.descriptionTextArea != $scope.description){
			var req = { 
				method: 'POST',
				url: 'users/user/'+$scope.screenName,
				data: $.param({description: $scope.descriptionTextArea, onlyDescription: true, originalScreenName: $scope.screenName}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
			$http(req).then(function successCallback(res){
				if (!jQuery.isEmptyObject(res.data)){
					$scope.description = res.data.description;
					$scope.descriptionInEdit = false;
				}
			}, function errorCallback(res) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		}
	}
});

// Controller for edit profile page.
app.controller('editProfileCtrl', function ($scope, $http){
	// Initialize edit profile page, extract user info from server and get session user.
	$scope.init = function(){
		var url = window.location.href;
		var name = url.split("=")[1];
		
		var req = {
			method: 'GET',
			url: 'users/user',
			params: {screenName: name}
		}
		$http(req).then(function successCallback(res){
			var userInfo = res.data;
			if (userInfo && !jQuery.isEmptyObject(userInfo)){
				if (userInfo.screen_name){
					$scope.screenName = userInfo.screen_name;
					$scope.originalScreenName = userInfo.screen_name;
				}
				if (userInfo.first_name){
					$scope.firstName = userInfo.first_name;
				}
				if (userInfo.last_name){
					$scope.lastName = userInfo.last_name;
				}
				if (userInfo.title){
					$scope.title = userInfo.title;
				}
				if (userInfo.gender){
					$scope.gender = userInfo.gender;
				}
				if (userInfo.date_of_birth){
					$scope.dateOfBirth = new Date(userInfo.date_of_birth);
				}
				if (userInfo.email){
					$scope.email = userInfo.email;
					$scope.originalEmail = userInfo.email;
				}
				if (userInfo.contact_email){
					if (userInfo.contact_email.address){
						$scope.contactEmail = userInfo.contact_email.address;
					}
					if (userInfo.contact_email.is_public){
						$scope.isPublicEmail = userInfo.contact_email.is_public;
					}
					else{
						$scope.isPublicEmail = false;
					}
				}
				if (userInfo.phone){
					if (userInfo.phone.number){
						$scope.phone = userInfo.phone.number;
					}
					if (userInfo.phone.is_public){
						$scope.isPublicPhone = userInfo.phone.is_public;
					}
					else{
						$scope.isPublicPhone = false;
					}
				}
				if (userInfo.address){
					if (userInfo.address.street){
						$scope.address = userInfo.address.street;
					}
					if (userInfo.address.city){
						$scope.city = userInfo.address.city;
					}
					if (userInfo.address.province){
						$scope.province = userInfo.address.province;
					}
					if (userInfo.address.country){
						$scope.country = userInfo.address.country;
					}
				}
				if (userInfo.image_name){
					$scope.profileImgName = userInfo.image_name;
				}
				else {
					if (userInfo.gender){
						switch (userInfo.gender){
							case "female":
								$scope.profileImgName = "female.png";
								break;
							case "male":
							case "others":
							default:
								$scope.profileImgName = "male.png";
						}
					}
				}
			}
			else{
				location.href = "/";
			}
		}, function errorCallback(res) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	}
	
	// Reference: http://stackoverflow.com/questions/13963022/angularjs-how-to-implement-a-simple-file-upload-with-multipart-form
	// Upload local image to update profile picture.
	$scope.uploadFile = function(files) {
		var fd = new FormData();
		var uploadUrl = "/images";
		fd.append("file", files[0]);

		$http.post(uploadUrl, fd, {
			withCredentials: true,
			headers: {'Content-Type': undefined },
			transformRequest: angular.identity
		}).then(function successCallback(res){
			// Reload file.
			$scope.uploaded = true;
			$scope.uploadMsg = "Your profile image is updated!";
			$scope.profileImgName = res.data.image_name;
		}, function errorCallback(res) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			$scope.uploaded = true;
			$scope.uploadMsg = "Failed to upload.";
		});
	};
	
	// Cancel profile edit and go back to profile page.
	$scope.backToProfile = function(){
		location.href = "profile?screen-name="+$scope.originalScreenName;
	}
	
	// Check if the input email address already exists in database (except for original email address).
	$scope.emailExists = function(){
		if ($scope.email && ($scope.email != $scope.originalEmail)){
			var req = {
				method: 'GET',
				url: 'users/user',
				params: {email: $scope.email}
			}
			$http(req).then(function successCallback(res){
				if (jQuery.isEmptyObject(res.data)){
					$scope.isInvalid = false;
				}
				else{
					$scope.isInvalid = true;
				}
			}, function errorCallback(res) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		}
		else{
			$scope.isInvalid = false;
		}
	}

	// Uncheck "show on profile" for phone number is phone number input is empty.
	$scope.checkPhone = function(){
		if ($scope.phone == ""){
			$scope.isPublicPhone = false;
		}
	}
	
	/* Validate screen name input. Screen name input should not contain any space, and should not 
	exists in current user database (except for original screen name).*/
	$scope.screenNameValidation = function(){
		if ($scope.screenName && ($scope.screenName != $scope.originalScreenName)){
			if ($scope.screenName.indexOf(" ") >= 0){
				$scope.screenNameInvalid = true;
			}
			else{
				$scope.screenNameInvalid = false;
				var req = {
					method: 'GET',
					url: 'users/user',
					params: {screenName: $scope.originalScreenName, newScreenName: $scope.screenName}
				}
				$http(req).then(function successCallback(res){
					if (jQuery.isEmptyObject(res.data)){
						$scope.screenNameFound = false;
					}
					else{
						$scope.screenNameFound = true;
					}
				}, function errorCallback(res) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
				});
			}
		}
		else{
			$scope.screenNameFound = false;
			$scope.screenNameInvalid = false;
		}
	}
});

// Controller for sign-up modal.
app.controller('signUpFormCtrl', function ($scope, $http){
	// Check if input email is already registered.
	$scope.emailExists = function(){
		if ($scope.email){
			var req = {
				method: 'GET',
				url: 'users/user',
				params: {email: $scope.email}
			}
			$http(req).then(function successCallback(res){
				if (jQuery.isEmptyObject(res.data)){
					$scope.isInvalid = false;
				}
				else{
					$scope.isInvalid = true;
				}
			}, function errorCallback(res) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		}
		else{
			$scope.isInvalid = false;
		}
	}
	
	/* Validate screen name input. Screen name input should not contain any space, and should not 
	exists in current user database */
	$scope.screenNameValidation = function(){
		if ($scope.screenName){
			if ($scope.screenName.indexOf(" ") >= 0){
				$scope.screenNameInvalid = true;
				$scope.screenNameInvalidMsg = "Screen name cannot contain any space.";
			}
			else if ($scope.screenName == "Guest"){
				$scope.screenNameInvalid = true;
				$scope.screenNameInvalidMsg = "Screen name cannot be 'Guest'.";
			}
			else{
				$scope.screenNameInvalid = false;
				var req = {
					method: 'GET',
					url: 'users/user',
					params: {screenName: $scope.screenName}
				}
				$http(req).then(function successCallback(res){
					if (jQuery.isEmptyObject(res.data)){
						$scope.screenNameFound = false;
					}
					else{
						$scope.screenNameFound = true;
					}
				}, function errorCallback(res) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
				});
			}
		}
		else{
			$scope.screenNameFound = false;
			$scope.screenNameInvalid = false;
		}
	}
	
	// Requires user to type password twice and password should be the same.
	$scope.confirmPassword = function(){
		if ($scope.reEnterPassword && $scope.password && $scope.password != $scope.reEnterPassword){
			$scope.passwordNotMatch = true;
		}
		else{
			$scope.passwordNotMatch = false;
		}
	}
});
// Getting the pathname
app.controller('navCtrl', function ($scope, $location) {  
    $scope.isActive = function (viewLocation) { 
    	var l = getLocation($location.absUrl());
      	return viewLocation === l.pathname;
    };
});
// Setting the search url when changed
app.controller('searchCtrl', function ($scope) {  
    $scope.changeParam = function(name) {
      $('#search_by').text(name);
      $('#param').val(name);
    };
});

// Controller for login modal
app.controller('login', function($scope, $http) {
	/* Send email and password to the server to validate. If match then login is successful. If not, 
	the error is either email not registered or password does not match.*/
    $scope.sendPost = function() {
		var req = { 
			method: 'POST',
			url: 'users/user',
			data: $.param({email: $scope.email, password: $scope.password, login: true}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}
		$http(req).then(function successCallback(res){
			if (!jQuery.isEmptyObject(res.data)){
				if (res.data.msg == "emailNotExist"){
					$scope.emailNotExist = true;
					$scope.passwordIncorrect = false;
				}
				else if (res.data.msg == "passwordIncorrect"){
					$scope.passwordIncorrect = true;
					$scope.emailNotExist = false;
				}
				else{
					location.reload();
				}
			}
			else{
				$scope.emailNotExist = false;
				$scope.passwordIncorrect = false;
			}
		}, function errorCallback(res) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
    };
});
// Formating the search results
app.directive("searchRes", function() {
    return {
        controller: function ($scope, $http, $location) {
        
            var searchBy;
            var terms;
            // from https://css-tricks.com/snippets/javascript/get-url-variables/
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == "param"){
                    searchBy = pair[1];
                }
                if(pair[0] == "terms"){
                    terms = pair[1];
                }
            }
            
            // Post request and redirect to search page with the parameters
            var req = { 
                method: 'POST',
                url: 'search/res',
                data: $.param({searchBy : searchBy , terms : terms}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
            $http(req).success(function(result){
                var searchBy;
                var query = window.location.search.substring(1);
                var vars = query.split("&");
                for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == "param"){
                        searchBy = pair[1];
                    }
                }
                // Search results formatting
                var numRes;
                if (result.length == 0)
                    numRes = '<h3 id="result">Total number of results: 0'+
                    '</h3><section class="col-xs-12 col-sm-6 col-md-12"><article class="search-result-row">';
                else
                    numRes = '<h3 id="result">Total number of results: ' + result.length+
                    ' </h3><section class="col-xs-12 col-sm-6 col-md-12"><article class="search-result-row">';
                $("#searchRes").append(numRes);
                // Course/Category results layout
                if (searchBy == "Course" || searchBy == "Category") {
                    for (var i = 0; i < result.length; i++) {
                        var rating = "";
                        var overall = 0;
                        var course = result[i]; 
                        if (course.comments.length > 0) {
                        	for (var k = 0; k < course.comments.length; k++) {
                                overall += course.comments[k].rating;
                            }
                  			overall = overall/course.votes;
                            for (var j = 0; j < Math.round(overall); j++) {
                                rating +='<i class="glyphicon glyphicon-star"></i>';
                            }
                        } else {
                            rating = "none";
                        }
                           
                        var res = '<h3><a href="course?id='+course._id+'">' + course.title + '</a></h3><ul id="result_info">'+
                        '<li>Category: '+course.category+
                        '</li><li>Teacher Name: <a href="profile?screen-name='+course.user+'">' + course.user + '</a></li><li>Course Rating: '+rating+
                        '</li><li>Difficulty Level: ' + course.difficulty + '</li></ul><p>' + course.description + '</p>';
                        
                        $("#searchRes").append(res);
                    
                    }
                    // User results layout
                } else if (searchBy == "User") {
                    for (var i = 0; i < result.length; i++) {
                        var user = result[i]; 
                        if (user.first_name == undefined)
                            user.first_name = "";                            
                        if (user.last_name == undefined)
                             user.last_name = "";
                        if (user.description == undefined)
                             user.description = "";
                            
                        var rating = "";
                        
                        var res = '<h3><a href="profile?screen-name='+user.screen_name+'">' + user.screen_name + '</a></h3><ul id="result_info">'+
                        '<li>Full Name: '+user.first_name+" "+user.last_name+
                        '<li>Gender: '+user.gender+
                        '<li>Description: '+ user.description +'</li></ul>';
                        
                        $("#searchRes").append(res);
                    
                    }
                    
                }
            }).error(function(){});
        }
    };
});
// Get session user and set up what needs to be displayed in the nav bar
app.directive("userLogin", function() {
    return {
        controller: function ($scope, $http) {
          $http({
            method: 'GET',
            url: "/getlogin"
            }).success(function(data){
              if (data != 'Guest') {
                $(".user").show();
                $(".guest").hide();
				$scope.loggedInUser = data;
				$("#screenName").html("<span class='glyphicon glyphicon-user'></span> " + $scope.loggedInUser);
				var req = { 
					method: 'POST',
					url: '/admin/check',
					data: $.param({screen_name: data}),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					};
					$http(req).success(function(data) {
						if (data[0].admin == true) {
							$(".admin").show();
						}
						else {
							$(".admin").hide();
						}
					});
              }
              else {
                $(".user").hide();
                $(".guest").show();
              }
            }).error(function(){
              console.log("error")
            });
        }
    };
});
