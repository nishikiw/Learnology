		function reset() {
          document.getElementById("form-review").reset();
      	};
		
		app.controller ("rating", function($scope) {
			$scope.heading = function (rating) {
				if (rating == 5) {
					return 'Perfect!';
				}
				if (rating == 4) {
					return 'Great';
				}
				if (rating == 3) {
					return 'Okay';
				}
				if (rating == 2) {
					return 'Not Great';
				}
				if (rating == 1) {
					return 'Terrible';
				}
			}

			$scope.checkRating = function (pos, rating) {
				if (rating >= pos) {
					return true;
				}
				else {
					return false;
				}
			};
		});

		app.controller ("submitForm", function($scope, $http, $window) {
			$scope.submit = function (course) {
				var req = { 
					method: 'POST',
					url: '/course/comment',
					data: $.param({
						id : course,
						user: $scope.session.toString(),
						rating: $scope.rate,
						comment: $scope.comment.toString()
					}),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				};
				$http(req).success(function(data) {
					$window.location.href = "/course?id=" + course;
				});
			}

			$scope.removeComment = function (user, course, rate, body) {
				var req = { 
					method: 'POST',
					url: '/course/comment/remove',
					data: $.param({
						id : course,
						screen_name: user,
						rating: rate,
						comment: body
					}),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				};
				$http(req).success(function(data) {
					$window.location.href = "/course?id=" + course;
				});
			}	
		});

		function getUser ($http, $scope, screen_name) {
				var req = { 
					method: 'POST',
					url: '/user/short',
					data: $.param({name : screen_name}),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				};
				$http(req).success(function(data) {
					$scope.instructorEmail = data[0].contact_email.address;
					if (data[0].first_name || data[0].last_name){
						$scope.InstructorName = data[0].first_name +  ' ' + data[0].last_name;
					}
					else{
						$scope.InstructorName = screen_name;
					}
					$scope.instructorTitle = data[0].title;
					$scope.gender = data[0].gender;
					if (data[0].image_name){
						$scope.instructorImageName = data[0].image_name;
					}
					else{
						switch ($scope.gender){
							case "female":
								$scope.instructorImageName = "female.png";
								break;
							case "male":
							case "others":
							default:
								$scope.instructorImageName = "male.png";
						}
					}
					if (data[0].phone.is_public && data[0].phone.number){
						$scope.phone = data[0].phone.number;
					}
				});
			};

		function overall (comments) {
			var sumRatings = 0;
			for (i=0; i<comments.length; i++) {
				sumRatings += comments[i].rating;
			}
			return Math.round(sumRatings/comments.length * 100) / 100;
		};
		
		app.directive("courseContent", function() {
		    return {
		        controller: function ($scope, $http, $location) {
					$scope.init = function(){
						var l = getLocation($location.absUrl());
						var param = l.search.substring(l.search.indexOf("=")+1);
						var req = { 
							method: 'POST',
							url: '/search/one',
							data: $.param({type: 'course-id', id : param}),
							headers: {'Content-Type': 'application/x-www-form-urlencoded'}
						};
						$http(req).success(function(data) {
							$scope.id = param;
							$scope.students = data[0].students;
							$scope.title = data[0].title;
							$scope.category = data[0].category;
							$scope.price = data[0].price;
							$scope.skills = data[0].skills;
							$scope.flagged = data[0].flagged;
							$scope.votes = data[0].votes;
							$scope.difficulty = data[0].difficulty;
							$scope.location = data[0].location;
							$scope.description = data[0].description;
							$scope.comments = data[0].comments;
							$scope.overall = overall(data[0].comments);
							$scope.screen_name = data[0].user;
							getUser ($http, $scope, data[0].user);
							var req = { 
							method: 'POST',
							url: '/admin/check',
							data: $.param({screen_name: $scope.session}),
							headers: {'Content-Type': 'application/x-www-form-urlencoded'}
							};
							$http(req).success(function(data) {
								if (data.length < 1) {
									$scope.admin = false;
								}
								else {
									$scope.admin = data[0].admin;
								}
							});
						});
					}
					
					$scope.hideEnroll = function(){
						if ($scope.session == $scope.screen_name || $scope.session == 'Guest'){
							return true;
						}
						else{
							return false;
						}
					}

					$scope.hideUnflag = function(){
						if ($scope.flagged == true && $scope.admin == true){
							return true;
						}
						else{
							return false;
						}
					}

					$scope.hideReport = function(){
						if ($scope.session == $scope.screen_name || $scope.session == 'Guest' || $scope.admin){
							return true;
						}
						else{
							return false;
						}
					}
					
					$scope.disableEnroll = function(){
						if (typeof $scope.students != 'undefined' && studentIndex($scope.session, $scope.students.enrolled) != -1){
							$scope.enrollText = "You have enrolled";
							return true;
						}
						else if (typeof $scope.students != 'undefined' && studentIndex($scope.session, $scope.students.in_application) != -1){
							$scope.enrollText = "You have applied";
							return true;
						}
						else{
							$scope.enrollText = "Enroll";
							return false;
						}
					}
					
					$scope.enroll = function() {
						if ($scope.session && $scope.session != "Guest" && $scope.session != $scope.screen_name){
							var req = {
								method: 'POST',
								url: 'courses/course/'+$scope.id,
								data: $.param({studentScreenName: $scope.session, message: $scope.enrollmentMsg}),
								headers: {'Content-Type': 'application/x-www-form-urlencoded'}
							}
							$http(req).then(function successCallback(res){
								if (res.data == "enrolled"){
									$scope.students.in_application.push({screen_name: $scope.session});
									$('#enrollModal').modal('toggle');
								}
								else{
									alert("Failed to enroll");
								}
							}, function errorCallback(res) {
								// called asynchronously if an error occurs
								// or server returns response with an error status.
							});
						}
					}
		        }
		    }
		});
		
		function studentIndex(screenName, array){
			for (var i=0; i<array.length; i++){
				if (array[i].screen_name == screenName){
					return i;
				}
			}
			return -1;
		}
		
		app.directive("getUser", function() {
		    return {
		        controller: function ($scope, $http) {
					var req = { 
						method: 'GET',
						url: '/getlogin'
					};
					$http(req).success(function(data) {
						$scope.session = data;
					});
		        }
		    }
		});
