var app = angular.module('learnologyApp', []);

var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

function submitform() {  
    document.searchform.submit(); 
} 

app.controller('signUpFormCtrl', function ($scope, $http){
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
	
	$scope.screenNameValidation = function(){
		if ($scope.screenName){
			if ($scope.screenName.indexOf(" ") >= 0){
				$scope.screenNameInvalid = true;
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
	
	$scope.confirmPassword = function(){
		if ($scope.reEnterPassword && $scope.password && $scope.password != $scope.reEnterPassword){
			$scope.passwordNotMatch = true;
		}
		else{
			$scope.passwordNotMatch = false;
		}
	}
});

app.controller('navCtrl', function ($scope, $location) {  
    $scope.isActive = function (viewLocation) { 
    	var l = getLocation($location.absUrl());
      	return viewLocation === l.pathname;
    };
});

app.controller('searchCtrl', function ($scope) {  
    $scope.changeParam = function(name) {
      $('#search_by').text(name);
      $('#param').val(name);
    };
});

app.controller('login', function($scope, $http) {
    $scope.sendPost = function() {
      var req = { 
        method: 'POST',
        url: 'login',
        data: $.param({username: $scope.username, password: $scope.password}),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }
      $http(req).success(function(data){
        if (data != 'Guest') {
          $('#loginModal').modal('toggle');
          $("#screenName").html("<span class='glyphicon glyphicon-user'></span> " + data);
          $(".user").show();
          $(".guest").hide();
        }
      }).error(function(){});
    };
});

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
            
            
            var req = { 
                method: 'POST',
                url: 'search/res',
                data: $.param({searchBy : searchBy , terms : terms}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
            $http(req).success(function(courses){
                var numRes;
                if (courses.length == 0)
                    numRes = '<h3 id="result">Total number of results: 0'+
                    '</h3><section class="col-xs-12 col-sm-6 col-md-12"><article class="search-result-row">';
                else
                    numRes = '<h3 id="result">Total number of results: ' + courses.length+
                    ' </h3><section class="col-xs-12 col-sm-6 col-md-12"><article class="search-result-row">';
                $("#searchRes").append(numRes);
                
                for (var i = 0; i < courses.length; i++) {
                    var rating = "";
                    var course = courses[i]; 
                    if (course.rating !=undefined) {
                        for (var j = 0; j < Math.round(course.rating); j++) {
                            rating +='<i class="glyphicon glyphicon-star"></i>';
                        }
                    } else {
                        rating = "none";
                    }
                       
                    var res = '<h3><a href="course/'+course._id+'">' + course.title + '</a></h3><ul id="result_info">'+
                    '<li>Teacher Name: <a href="profile/'+course._id+'">' + course.user + '</a></li><li>Course Rating: '+rating+
                    '</li><li>Difficulty Level: ' + course.difficulty + '</li></ul><p>' + course.description + '</p>';
                    
                    $("#searchRes").append(res);
                
                }
            }).error(function(){});
        }
    };
});

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
                $("#screenName").html("<span class='glyphicon glyphicon-user'></span> " + data);
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
