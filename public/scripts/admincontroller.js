app.controller("list", function($scope, $http) {
    $scope.title = "Users List";
    $scope.link = "profile";
    $scope.use = true;
    convertList ('screen_name', { method: 'GET', url: 'users' });

    function convertList (type, req) {
      var arr = [];
      $http(req).success(function(data){
        for (elem in data) {
          if (type=='screen_name') {
            arr.push(data[elem].screen_name);
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
        $scope.link = "profile";
        $scope.use = true;
        convertList ('screen_name', { method: 'GET', url: 'users' });
      }
      else {
        $scope.title = "Courses List";
        $scope.link = "course";
        $scope.use = false;
        convertList ('title', { method: 'GET', url: 'courses' });
      }
    };

    $scope.getFlagged = function() {
      if ($scope.confirmed) {
        if ($scope.title = "Users List") {
          convertList ('screen_name', { method: 'GET', url: 'users/flagged' });
        }
        else {
          cconvertList ('title', { method: 'GET', url: 'courses/flagged' });
        }
      }
      else {
        if ($scope.title = "Users List") {
          convertList ('screen_name', { method: 'GET', url: 'users' });
        }
        else {
          cconvertList ('title', { method: 'GET', url: 'courses' });
        }
      }
    };

    $scope.delete = function(x) {
      $scope.value = $scope.data[x];
    };

    $scope.findItem = function () {
      if($scope.title == "Users List") {
        var req = { 
          method: 'POST', 
          url: 'admin/search', 
          data: $.param({type: 'user', screen_name: $scope.searchID}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}};

        convertList ('screen_name', req);
      }
      else {
        var req = { 
          method: 'POST', 
          url: 'admin/search', 
          data: $.param({type: 'course', title: $scope.searchID}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}};

        convertList ('title', req);
      }
    };

    $scope.removeItem = function () {
      if($scope.title == "Users List") {
        $http({
          method: 'POST', 
          url: 'delete/user', 
          data: $.param({screen_name: $scope.value}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data){
          convertList ('screen_name', { method: 'GET', url: 'users' });
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
