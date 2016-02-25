var ref = new Firebase("https://amber-torch-1283.firebaseio.com/");

var tools = ref.child("tools");

var newTools = ref.child("newTools");

tools.on("child_added", function(snapshot){
    var updateObj = {};
    updateObj[snapshot.val().species] = {"users":{}};

    newTools.child(snapshot.val().genus).child(snapshot.val().species).update({"users":"empty"});
})
