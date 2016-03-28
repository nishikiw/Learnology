var app = angular.module('learnologyApp', []);

var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

function submitform() {  
    document.searchform.submit(); 
} 

app.controller('editProfileCtrl', function ($scope, $http){
	$scope.init = function(){
		var url = window.location.href;
		$scope.screenName = url.split("=")[1];
		
		var req = {
			method: 'GET',
			url: 'users/user',
			params: {screenName: $scope.screenName}
		}
		$http(req).then(function successCallback(res){
			var userInfo = res.data;
			if (userInfo.first_name){
				$scope.firstName = userInfo.first_name;
			}
			if (userInfo.last_name){
				$scope.lastName = userInfo.last_name;
			}
			if (userInfo.gender){
				$scope.gender = userInfo.gender;
			}
			if (userInfo.date_of_birth){
				$scope.dateOfBirth = userInfo.date_of_birth;
			}
			if (userInfo.email){
				$scope.email = userInfo.email;
			}
			if (userInfo.phone){
				$scope.phone = userInfo.phone;
			}
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
		}, function errorCallback(res) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	}
});

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
