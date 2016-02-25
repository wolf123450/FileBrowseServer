var ref = new Firebase("https://amber-torch-1283.firebaseio.com/");

var tools = ref.child("tools");

var newTools = ref.child("newTools");

tools.on("child_added", function(snapshot){
    newTools.child(snapshot.val().genus).push(snapshot.val().species);
})
