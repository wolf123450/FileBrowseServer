var express = require('express');
var app = express();
var serveIndex = require('serve-index');
var jade = require('jade');

var fs = require('fs');
var JSZip = require("jszip");

// var commandArgs = process.argv.slice(2);
//
// if (commandArgs
// var EventLogger = require('node-windows').EventLogger;

// var log = new EventLogger('File Server');

// log.info(__dirname); //View with event viewer


app.use(express.static(__dirname + '/html'));
// app.use('/videos', serveIndex(__dirname + "/videos", {'icons':true, 'stylesheet':"C:/Users/Clint/workspace/TwitterClone/html/styles/serveIndex.css"}));
app.use('/vids', serveIndex(__dirname + "/videos", {'icons':true, 'stylesheet': __dirname + "/html/styles/serveIndex.css"}));

//Jade template setup for Mp4 files
var options = {pretty:"    "};
var mp4template = jade.compileFile(__dirname + "/jade-templates/mp4.jade", options);
app.get('/vids*.mp4', function(req, res){
  var path = req.path.replace("vids", "videos");
  var locals = {
    pageTitle:"Your Movie",
    videoSource:path,  //Hacky, but functional
    prev: "/",  //TODO get correct paths.
    next: "/"
    };
  var fileParts = decodeURIComponent(path).split("/");
  fileName = fileParts[fileParts.length-1];
  // console.log(fileParts);
  fileParts.shift(); //Delete first element because it is empty (Starts with /)
  fileParts.splice(fileParts.length-1, 1);
  //console.log(fileParts[0]);
  var dir = fileParts.join("/");
  fs.readdir(__dirname +"/"+ (dir), function(err, files){
    if (err){
      console.error(err);
      return;
    }
    var index = files.indexOf(fileName);
    locals.prev = files[index-1];
    locals.next = files[index+1];

    var html = mp4template(locals);
    res.send(html);
  });
});
app.use('/videos', express.static(__dirname + '/videos'));

var getCbzPageCount = function(fileLocation, cb){
  var i = 0;
  fs.readFile(fileLocation, function(err, data) {
    if (err) throw err;
    var zip = new JSZip(data);
    //var i = 0;
    var fileName = "";
    for (var f in zip.files){
      i++;
    }
    cb(i);
  });
};

//Serve cbz files
var cbztemplate = jade.compileFile(__dirname + "/jade-templates/cbz.jade", options);
app.get('/vids*.cbz',function(req,res){
  var path = req.path; //.replace("vids", "cbz");
  var locals = {
    pageTitle:"Comic",
    imageSource:path.replace("vids", "cbz"),  //Hacky, but functional
    prev: "/",  //TODO get correct paths.
    next: "/"
    };
  var file = decodeURIComponent(path);

  var index = Number(req.query.page ? req.query.page : 0);
  locals.prev = file + "?page=" + (index-1 >=0 ? index-1: 0);
  locals.imageSource += "?page=" + index;
  locals.next = file + "?page=" + (index + 1);

  var fileLocation = file.replace("vids", "videos");

  getCbzPageCount(__dirname + fileLocation, function(count){
    if (index + 1 >= count) {
      // link to next File seamlessly
      var fileParts = fileLocation.split("/");
      fileName = fileParts[fileParts.length-1];
      fileParts.shift(); //Delete first element because it is empty (Starts with /)
      fileParts.splice(fileParts.length-1, 1); //Delete last element, filename;
      var dir = fileParts.join("/");

      fs.readdir(__dirname + "/" + dir, function(err, files){
        if (err){
          console.error(err);
          return;
        }
        var index = files.indexOf(fileName);
        // locals.prev = files[index-1];
        locals.next = files[index+1];

        var html = cbztemplate(locals);
        res.send(html);
      });
    } else if (index - 1 < 0){
      //Go to previous file seamlessly
      var fileParts = fileLocation.split("/");
      fileName = fileParts[fileParts.length-1];
      fileParts.shift(); //Delete first element because it is empty (Starts with /)
      fileParts.splice(fileParts.length-1, 1); //Delete last element, filename;
      var dir = fileParts.join("/");

      fs.readdir(__dirname + "/" + dir, function(err, files){
        if (err){
          console.error(err);
          return;
        }
        var index = files.indexOf(fileName);
        locals.prev = files[index-1];
        //locals.next = files[index+1];

        var html = cbztemplate(locals);
        res.send(html);
      });
    }else{
      //console.log(getCbzPageCount(__dirname +  fileLocation));
      var html = cbztemplate(locals);
      res.send(html);
    }
  });





});

app.use('/cbz', function(req,res){
  // var path = req.path.replace("cbz", "videos");
  var path = "/videos" + req.path
  var index = req.query.page ? req.query.page : 0;

  var file = decodeURIComponent(path);
  // read a zip file
  // console.log(__dirname + file);
  fs.readFile(__dirname + file, function(err, data) {
    if (err) throw err;
    var zip = new JSZip(data);
    var i = 0;
    var fileName = "";
    for (var f in zip.files){
      // console.log(f);
      fileName = f;
      if (i >= index){
        break;
      }
      i++;
    }
    res.set('Content-Type', 'image/jpeg');
    res.send(zip.files[f].asNodeBuffer());
  });

});



app.listen(3000, function() {
  console.log('Static server listening on port 3000!');
});
