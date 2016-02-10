var myApp = angular.module("myApp", ["firebase"]);

myApp.controller("MyController", ["$scope", "$firebaseArray", "$firebaseAuth",
  function($scope, $firebaseArray, $firebaseAuth) {
    //CREATE A FIREBASE REFERENCE
    var ref = new Firebase("https://amber-torch-1283.firebaseio.com/");
    var tools = ref.child("tools");
    var toolGenus = new Set();
    // GET MESSAGES AS AN ARRAY
    $scope.tools = $firebaseArray(tools.orderByChild("genus"));

    tools.orderByChild("genus").on("child_added", function(snapshot){
      toolGenus.add(snapshot.val().genus);
      console.log(toolGenus);
    });

    tools.orderByChild("genus").equalTo("Screwdriver").on("child_added", function(snapshot){
      // Do something for every common child genus that is equal to Hammer.
      // console.log(snapshot.val().genus);
      console.log(snapshot.val().species);
    });

    $scope.update = function(tool) {
      // $scope.tools.$add({
      //   genus:"test",
      //   species:"test two"
      // });
      $scope.tools.$add(tool);
    };

    $scope.reset = function() {
      $scope.tool = {}
    };

    $scope.reset();

    $scope.removeMessage = function(tool){
      $scope.tools.$remove(tool);
    }


  }
]);
