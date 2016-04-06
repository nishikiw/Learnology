    app.controller('save', function($scope, $http, $window) {
    	// Save any changes to course info
        $scope.save = function() {
          if ($scope.disable == true) {
             $scope.location = "online"
          }
          var req = { 
             method: 'POST',
             url: 'course/save',
             data: $.param({
             id: $scope.id,
             title: $scope.title.toString(), 
             location: $scope.location.toString(),
             category: $scope.category.toString(),
             description: $scope.description.toString(),
             price: $scope.price.toString(),
             difficulty: $scope.level.toString(),
             skills: $scope.skills.toString()}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }
          $http(req).success(function(data) {
             $window.location.href = "/course?id=" + $scope.id;
          });
        }; 
    });
// Getting the current course content and put it in the input form
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
					if (data[0].location == "online") {
						$scope.disable = true;
					}
					$scope.instructor = data[0].user;
					if ($scope.session == "Guest" || $scope.session != $scope.instructor){
						location.href = "/";
					}
					$scope.id = param;
					$scope.title = data[0].title;
					$scope.category = data[0].category;
					$scope.price = data[0].price;
					$scope.skills = data[0].skills;
					$scope.level = data[0].difficulty;
					$scope.location = data[0].location;
					$scope.description = data[0].description;
					$scope.students = data[0].students;
				});
			}
			
			$scope.enrollStudent = function(screenName, email){
				var req = { 
					method: 'POST',
					url: 'courses/course/'+$scope.id,
					data: $.param({screenName: screenName, contactEmail: email, acceptStudent: true}),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}
				$http(req).then(function successCallback(res){
					if (res.data == "accepted"){
						$scope.students.enrolled.push({screen_name: screenName, contact_email: email});
						var studentIndexInApplication = getStudentIndex(screenName, $scope.students.in_application);
						if (studentIndexInApplication != -1){
							$scope.students.in_application.splice(studentIndexInApplication, 1);
						}
					}
					else{
						alert("Failed to accepct student: "+screenName);
					}
				}, function errorCallback(res) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
				});
			}
			
			$scope.toggleRejectModal = function(student){
				$scope.selectedStudent = student;
				$('#rejectModal').modal('show');
			}
			
			$scope.toggleFinishModal = function(student){
				$scope.selectedStudent = student;
				$('#finishModal').modal('show');
			}
			
			$scope.cancelSelect = function(){
				$scope.selectedStudent = null;
				$('#rejectModal').modal('hide');
				$('#finishModal').modal('hide');
			}
			
			$scope.rejectStudent =function(){
				if ($scope.selectedStudent){
					var req = { 
						method: 'POST',
						url: 'courses/course/'+$scope.id,
						data: $.param({screenName: $scope.selectedStudent.screen_name, rejectStudent: true}),
						headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					}
					$http(req).then(function successCallback(res){
						if (res.data == "rejected"){
							var rejectedStudentIndex = getStudentIndex($scope.selectedStudent.screen_name, $scope.students.in_application);
							if (rejectedStudentIndex != -1){
								$scope.students.in_application.splice(rejectedStudentIndex, 1);
							}
						}
						else{
							alert("Reject student '"+$scope.selectedStudent.screen_name+"' failed.");
						}
						$scope.selectedStudent = null;
						$('#rejectModal').modal('hide');
					}, function errorCallback(res) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.
					});
				}
			}
			
			$scope.finishStudent =function(){
				if ($scope.selectedStudent){
					var req = { 
						method: 'POST',
						url: 'courses/course/'+$scope.id,
						data: $.param({screenName: $scope.selectedStudent.screen_name, finishStudent: true}),
						headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					}
					$http(req).then(function successCallback(res){
						if (res.data == "finished"){
							var finishedStudentIndex = getStudentIndex($scope.selectedStudent.screen_name, $scope.students.enrolled);
							if (finishedStudentIndex != -1){
								$scope.students.enrolled.splice(finishedStudentIndex, 1);
							}
						}
						else{
							alert("Finish student '"+$scope.selectedStudent.screen_name+"' failed.");
						}
						$scope.selectedStudent = null;
						$('#finishModal').modal('hide');
					}, function errorCallback(res) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.
					});
				}
			}
		}
	}
});
  
function getStudentIndex(screenName, array){
	for (var i=0; i < array.length; i++){
		if (array[i].screen_name == screenName){
			return i;
		}
	}
	return -1;
}
  // Get the session user 
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
	
app.directive('listItemFocus', function() {
	return function(scope, element) {
		element.bind('mouseenter', function() {
			element.css("background-color", "whitesmoke");
			element.find("span.small").css("visibility", "visible");
		});
		element.bind('mouseleave', function() {
			element.css("background-color", "white");
			element.find("span.small").css("visibility", "hidden");
		});
	};
});
