app.controller("list", function($scope, $http) {
      $scope.title = "Users List";
      convertList ('username', { method: 'GET', url: 'users' });

      function convertList (type, req) {
        var arr = [];
        $http(req).success(function(data){
          for (elem in data) {
            if (type=='username') {
              arr.push(data[elem].username);
            }
            else {
              arr.push(data[elem].title);
            }
          }
          $scope.data = arr;
        }).error(function(){});
      };

      $scope.getlist = function(list) {
        if (list == 'users') {
          $scope.title = "Users List";
          convertList ('username', { method: 'GET', url: 'users' });
        }
        else {
          $scope.title = "Courses List";
          convertList ('title', { method: 'GET', url: 'courses' });
        }
      };

      $scope.delete = function(x) {
        $scope.value = $scope.data[x];
      };

      $scope.removeItem = function () {
        if($scope.title == "Users List") {
          $http({
            method: 'POST', 
            url: 'delete/user', 
            data: $.param({username: $scope.value}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).success(function(data){
            convertList ('username', { method: 'GET', url: 'users' });
          }).error(function(){});
        }
        else {
          $http({
            method: 'POST', 
            url: 'delete/course', 
            data: $.param({title: $scope.value}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).success(function(data){
            convertList ('title', { method: 'GET', url: 'courses' });
          }).error(function(){});
        }
      };
  });
