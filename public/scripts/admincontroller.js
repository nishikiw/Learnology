// Controller for the admin page
app.controller("list", function($scope, $http) {
    // Default Values
    $scope.title = "Users";
    $scope.link = "profile";
    $scope.use = true;
    convertList ('screen_name', { method: 'GET', url: 'users' });

    // Sends http request and format/output the results based on the type of list (users or courses)
    function convertList (type, req) {
      var arr = [];
      $http(req).success(function(data){
        for (elem in data) {
          if (type=='screen_name') {
            arr.push([data[elem].screen_name, data[elem].screen_name, data[elem].admin, data[elem].flagged]);
          }
          else {
            arr.push([data[elem]._id, data[elem].title, 'blank', data[elem].flagged]);
          }
        }
        $scope.data = arr;
      }).error(function(){});
    };
    // When button clicks to change the list type, values get changed
    $scope.getlist = function(list) {
      if (list == 'Users') {
        $scope.title = "Users";
        $scope.link = "profile";
        $scope.use = true;
        $scope.confirmed = false;
        convertList ('screen_name', { method: 'GET', url: 'users' });
      }
      else {
        $scope.title = "Courses";
        $scope.link = "course";
        $scope.use = false;
        $scope.confirmed = false;
        convertList ('title', { method: 'GET', url: 'courses' });
      }
    };
    
    // Filters out items that have been reported (in red)
    $scope.getFlagged = function() {
      if ($scope.confirmed) {
        if ($scope.title == "Users") {
          convertList ('screen_name', { method: 'GET', url: 'users/flagged' });
        }
        else {
          convertList ('title', { method: 'GET', url: 'courses/flagged' });
        }
      }
      else {
        if ($scope.title == "Users") {
          convertList ('screen_name', { method: 'GET', url: 'users' });
        }
        else {
          convertList ('title', { method: 'GET', url: 'courses' });
        }
      }
    };
    
    // Sets deletion value when x button clicked
    $scope.delete = function(x) {
      $scope.value = $scope.data[x][0];
    };

    // Used for search bar (get the search results)
    $scope.findItem = function () {
      if($scope.title == "Users") {
        var req = { 
          method: 'POST', 
          url: '/search/one', 
          data: $.param({type: 'user', screen_name: $scope.searchID}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}};

        convertList ('screen_name', req);
      }
      else {
        var req = { 
          method: 'POST', 
          url: '/search/one', 
          data: $.param({type: 'course', title: $scope.searchID}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}};

        convertList ('title', req);
      }
    };
    
    // Deleteing an item and refreshing the list
    $scope.removeItem = function () {
      if($scope.title == "Users") {
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
          data: $.param({id: $scope.value}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data){
          convertList ('title', { method: 'GET', url: 'courses' });
        }).error(function(){});
      }
    };
    
    // Set user as admin based on the screen name input
    $scope.setAdmin = function () {
      $http({
          method: 'POST', 
          url: 'admin/set', 
          data: $.param({screen_name: $scope.sname}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data){
          convertList ('screen_name', { method: 'GET', url: 'users' });
        }).error(function(){});
    };
});
