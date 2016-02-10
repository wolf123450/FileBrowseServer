var myApp = angular.module("myApp", ["firebase"]);

myApp.controller("MyController", ["$scope", "$firebaseArray", "$firebaseAuth",
  function($scope, $firebaseArray, $firebaseAuth) {
    //CREATE A FIREBASE REFERENCE
    var ref = new Firebase("https://amber-torch-1283.firebaseio.com/");
    var messages = ref.child("messages");
    var users = ref.child("users");
    // var ref = new Firebase("https://luminous-torch-6850.firebaseio.com/chatty");
    // create an instance of the authentication service
    var auth = $firebaseAuth(ref);
    //login with Facebook
    $scope.loginFacebook = function(){
      ref.authWithOAuthPopup("facebook", function(error, authData) {
        $scope.$apply( function() {
            $scope.name = authData.facebook.displayName;
            users.child(authData.uid).set({
              "name": authData.facebook.displayName,
              "email":authData.facebook.email
            });
          }
        );
      },{
        remember: "sessionOnly",
        scope: "email,user_likes"
      });
    }


    // GET MESSAGES AS AN ARRAY
    $scope.messages = $firebaseArray(messages);
    // ref.on("child_added", function(snapshot, prevChildKey) {
    //   var newPost = snapshot.val();
    //   console.log(newPost);
    // });
    //ADD MESSAGE METHOD
    $scope.addMessage = function(e) {

      //LISTEN FOR RETURN KEY
      if (e.keyCode === 13 && $scope.msg) {
        //ALLOW CUSTOM OR ANONYMOUS USER NAMES
        var name = $scope.name || "anonymous";

        //ADD TO FIREBASE
        $scope.messages.$add({
          //from: name,
          sender: name,
          //body: $scope.msg,
          message: $scope.msg
        });

        //RESET MESSAGE
        $scope.msg = "";
      }
    }

    $scope.removeMessage = function(message){
      $scope.messages.$remove(message);
    }


  }
]);
