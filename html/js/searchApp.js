var searchApp = angular.module("searchApp", ["firebase"]);

searchApp.controller("SearchController", ["$scope", "$firebaseArray", "$firebaseAuth",
  function($scope, $firebaseArray, $firebaseAuth) {
    //CREATE A FIREBASE REFERENCE
    var ref = new Firebase("https://amber-torch-1283.firebaseio.com/");
    var tools = ref.child("tools");

    // GET MESSAGES AS AN ARRAY
    $scope.results = $firebaseArray(tools.orderByChild("genus"));

    $scope.update = function(query) {
      $scope.results = $firebaseArray(tools.orderByChild("genus").startAt(query).endAt(query + "\uf8ff"));
    };

  }
]);
