var app = angular.module('categoryApp', []);

var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

app.controller('navCtrl', function ($scope, $location) {  
    $scope.isActive = function (viewLocation) { 
    	var l = getLocation($location.absUrl());
      	return viewLocation === l.pathname;
    };
});

app.controller("topCtrl", function($scope) {
    $scope.topList = [
           {rank: '1', course:'Linear Algebra', votes:'58', rating: '4.3'},
           {rank: '2',course:'Chemistry',votes:'54', rating: '4.4'},
           {rank: '3',course:'Biology',votes:'53', rating: '4.0'},
           {rank: '4',course:'French',votes:'50', rating: '3.9'},
           {rank: '5',course:'English For Non-speakers',votes:'47', rating: '3.8'},
           {rank: '6',course:'Note Taking',votes:'44', rating: '4.0'},
           {rank: '7',course:'Canadian History',votes:'43', rating: '3.7'},
           {rank: '8',course:'Studying Strategies',votes:'38', rating: '4.0'},
           {rank: '9',course:'Grammar',votes:'27', rating: '4.6'},
           {rank: '10',course:'Calculus',votes:'32', rating: '3.6'}];
});

$(document).ready(function(){
  $(".nav-pills>li").click(function(){
    $(".nav-pills>li").removeClass();
    $(this).addClass("active");
  });
  $(".btn-primary").click(function(){
    if ($(this).text() == "Look At Top 10 Courses") {
      $(this).text("Look At Categories");
    }
    else  {
      $(this).text("Look At Top 10 Courses");
    }
  });

});