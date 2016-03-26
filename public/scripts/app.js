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
