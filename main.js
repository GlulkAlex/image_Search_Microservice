"use strict";
// TODO create an alternative start file: main.js using express
/*
.env
MONGO_URI=mongodb://localhost:27017/clementinejs
*/
//*** config ***//
//const
var env = () => {
  try {

    return require('./.env.json');
  } catch(err) {
    console.warn("config file missing, so as actual connection info too");

    return {
      "TEST_MONGODB": {
        "value": false
      }
      ,"DEBUG_MODE": {
        "value": false
      }
    };
  }
}();

const is_Debug_Mode = (
  process.env.IS_DEBUG ||
  env.DEBUG_MODE.value ||
  process.argv[2]
  //true
  //false
);
const port_Number = (
  //process.argv[3] ||
  process.env.PORT ||
  //0
  8080 ||
  3000
);
const mongo_URI = (
  process.env.MONGO_URI ||
  //env.TEST_MONGODB.value ||
  process.argv[3] ||
  "mongodb://localhost:27017/data"
);
//TEST_MONGODB
//MONGOLAB_URI:
const mongoLab_URI = (
  // must be on `.env` file or
  // in heroku config
  // it is possible
  // to use the same config var
  // in both local and Heroku environments
  process.env.MONGOLAB_URI ||
  process.env.TEST_MONGODB ||
  env.TEST_MONGODB.value ||
  process.argv[3] ||
  "mongodb://localhost:27017/data_uri"
);
const collection_Name = (
  //"docs" // <- for tests only
  //"links"
  "image_search_results"
);
//*** config end ***//

//*** Node.js modules ***//
//*** core modules ***//
//const http = require('http');
//const https = require('https');
//const fs = require('fs');
//const path = require('path');
const url = require('url');
const assert = require('assert');
//*** core modules end ***//

//*** npm modules ***//
const express = require('express');
var app = express();
// Router-level middleware works
// in the same way as application-level middleware, except
// it is bound to an instance of express.Router().
var router = express.Router();

const mongo_Client = require('mongodb').MongoClient;
//*** npm modules end ***//

// for correct connection using .env
// use `heroku local` or `heroku open [<url.path>]`
//const mongo = require('mongodb').MongoClient;

//*** application modules ***//
//const short_Link_Gen = require('./short_link_generator.js');//.short_Link_Generator;
//const host_Name_Validator = require('./host_Name_Validator.js');
//const db_Helpers = require('./db_Helpers.js');
//const response_Helpers = require('./response_Helpers.js');
//*** application modules end ***//

// redundant here, has no practical use
const end_Points_List = [
  "/"
  ,"/new" // special entry point
  //,"/home",
  //,"/help",
  //,"/info"
];

var server;
var input_args_list = process.argv;
var node_ = input_args_list[0];
var self_file_path = input_args_list[1];
var document_Obj = {
  'firstName': "Alex",//first_Name,
  'lastName': "Gluk"//last_Name
};
// instead fetch template
var index_Template_Content_List = [
  '<html>',
    '<head>',
      '<title>Image Search Abstraction Layer Microservice API</title>',
      //'<link rel="icon" type="image/x-icon"',
      //'href="favicon.ico" />',
      //'<link rel="stylesheet" type="text/css" href="/main.css"/>',
      '<style>',
        'body {',
          'background-color: lightblue;',
        '}',
      '</style>',
    '</head>',
    '<body>',
      '<h1>API Basejump: Image Search Abstraction Layer</h1>',
    '</body>',
  '</html>'
];
var index_Template_Content_Str = index_Template_Content_List.join("\n");
var getter = (
  app
  //http
  //https
);
var response_Body; 
var source_Link = "";
var links_Count = 0;
var options = {};


console.log("is_Debug_Mode:", is_Debug_Mode);
// inline condition
// !(true) || console.log('log'); => log
//JSON.stringify(value[, replacer[, space]])
if (is_Debug_Mode) {
  console.log(
    "process.env:",
    JSON.stringify(
      process.env
      ,['PORT', 'IS_DEBUG', 'DEBUG_MODE', 'MONGO_URI', 'MONGOLAB_URI', 'TEST_MONGODB']
      // works as "pretty print"
      ,'\t'
    )
  );}

//var MongoClient = mongo;
if (is_Debug_Mode) {
  //mongo.define.name == 'MongoClient'
  /*
  if (mongo.hasOwnProperty("define")) {
    console.log("mongo.define.name:", mongo.define.name);
  } else {
    console.log("typeof mongo:", typeof(mongo));
  }
  */
}


/*
// to find string of specific length
// without dedicated 'length' field
{
  "short_url": {
    // to ensure schema correctness
    $exists: true,
    $type: <BSON type number>2 | <String alias>"string"
    "$regex": "/^[A-z]{3}$/"
  }
}
*/

if (input_args_list.length >= 3) {
  //first_Name = input_args_list[2].trim();
}

//server listen on [object Object]
//console.log(`server listen on ${address}`);
// %j work as JSON.stringify -> flatten object
//server listen on {"address":"127.0.0.1","family":"IPv4","port":8080}
if (is_Debug_Mode) {console.log('MONGO_URI is: %j', mongo_URI);}
if (is_Debug_Mode) {console.log('MONGOLAB_URI is: %j', mongoLab_URI);}
if (is_Debug_Mode) {console.log('__dirname is:', __dirname);}

// best practice is
// to to turn off the header with the app.disable() method:
app.disable('x-powered-by');

app
  .route('/')
  .get(
    (req, res, next) => {
      /*
      res
        .send('Hello World!')
        .end()
      ;*/
      //res.end([data] [, encoding])

      ///res.render('index.html');
      //res.sendFile(path [, options] [, fn])
      var options = {
        root: __dirname// + '/public/'
        ,dotfiles: 'deny'
        ,headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
      };

      var fileName = __dirname + "/index.html";//req.params.name;
      /**/
      // async (? Promise ?)
      res
        // no need for app.use(express.static('/'));
        .sendFile(fileName
          ,null//options
          // If the callback function is specified and
          // an error occurs,
          // the callback function must
          // explicitly `handle` the response process
          // either by `ending` the request-response cycle, or
          // by passing control to the `next` route.
          ,(err) => {
            if (err) {
              if (is_Debug_Mode) {
                console.log(
                  ".sendFile(", fileName, ") error:", err);}
              res
                .status(err.status)
                // send headers
                .end()
              ;
              // after end() causes
              // Error: Can't set headers after they are sent.
              // for next routes
              //next();
            }
            else {
              if (is_Debug_Mode) {console.log('Sent:', fileName);}
              res
                // send headers
                .end();

              // use something one: .end() or next() -> not both simultaneously
              //next();
            }
          }
      )
      // TypeError: Cannot read property 'then' of undefined
      // ? so warper needed ?
      //.then(() => {if (is_Debug_Mode) {console.log(".sendFile() is \"thenable\"");}})
      //.catch((err) => {if (is_Debug_Mode) {console.log(".sendFile().catch(err):", err.message);}})
      ;/**/

      // if active fires / emits before .sendFile() is complete
      // and screw it in the process -> Error: Request aborted
      //next();
  }
);

app
  // "/api/imagesearch/:term/" -> req.params.keyName => term
  // req.params.term => "owl%20funny?offset=10"
  .route("/api/imagesearch/:term/")
  .get(
    (req, res, next) => {
    // for example.com/users?sort=desc -> req.path => "/users"
    // for route /user/:name
    // GET /user/tj -> req.params.name => "tj"
    // GET /search?q=tobi+ferret -> req.query.q => "tobi ferret"
    // GET /lolcats%20funny?offset=10
    var offset = 0;
    var json_Obj = {};
    var document_Obj = {};

    document_Obj = {
      "term": req.params.term//JSON.stringify(document_Obj)
      // NOTE
      // The BSON `timestamp` type is for internal MongoDB use.
      /*
      Date
      BSON Date is
      a 64-bit integer
      that represents the number of milliseconds since the Unix epoch (Jan 1, 1970).
      This results in
      a representable date range
      of about 290 million years into the past and future.
      The official BSON specification refers to the BSON Date type as
      the UTC datetime.
      Changed in version 2.0: BSON Date type is signed.
      Negative values represent dates before 1970.
      */
      // Using new Date(), creates a new date object with the current date and time
      ,"when": new Date()
        //"2016-04-08T08:12:08.752Z"
        // The T in the date string, between the date and time, indicates UTC time.
        // UTC (Universal Time Coordinated) is the same as GMT (Greenwich Mean Time).
    };
    if (req.query.hasOwnProperty("offset")) {
      offset = req.query.offset;
    }

    // async block //
    var connection = mongo_Client.connect(mongoLab_URI);

    connection
      .then((db) => {
          var collection = db.collection(collection_Name);

          //return db;
          return {"db": db, "collection": collection};
        }
      )
      .then((result_Obj) => {
          var db = result_Obj.db;
          var collection = result_Obj.collection;

          //return db;
          return Promise
            .resolve({
              "db": db
              ,"collection": collection
              ,"insert_Result": collection
                .insertOne(
                  document_Obj
                  //JSON.stringify(document_Obj)
                ).then((insert_Result) => {return insert_Result;})
          })
          ;
        }
      )
      .then((insert_Result_Obj) => {//.result.n
          //console.log(JSON.stringify(document_Obj));
          //if (is_Debug_Mode) {console.log('inserted document_Obj: %j', document_Obj);}
          if (is_Debug_Mode) {console.log("result.result.n:", insert_Result_Obj.insert_Result.result.n);}
          //console.log('result.result: %j', result.result);

          /* finally */
          if (insert_Result_Obj.db) {
            insert_Result_Obj.db.close();
            if (is_Debug_Mode) {console.log("Close db after link insert(ion/ed)");}
          }

          //return Promise.resolve(result.result.ok);
        }
      )
      .catch((err) => {
          if (is_Debug_Mode) {console.log("collection.insertOne() error:", err.stack);}
          /* finally */
          /*if (db) {
            db.close();
            if (is_Debug_Mode) {console.log("Close db after insertOne().catch()");}
          }*/

          //return Promise.reject(err);
        }
      )
    ;
    // async block end //

    json_Obj = {
      "error": false//true//'message'
      ,"status": 200// OK
      ,"message": "imagesearch requested (req.path): " + req.path +
        ", req.params.term:" + req.params.term +
        ", req.query:" + JSON.stringify(req.query) +
        ", offset:" + offset
    };

    res
      // 202 Accepted
      // 203 Non-Authoritative Information
      // 204 No Content
      // 302 Found
      .status(200)
      // different Content-Type HTTP header MIME type
      // res.type('.html');              // => 'text/html'
      // res.type('html');               // => 'text/html'
      // res.type('json');               // => 'application/json'
      // res.type('application/json');   // => 'application/json'
      // res.type('png');                // => image/png:
      // so can not use it simultaneously
      //.send("Custom 200 page. All OK.")
      .jsonp(json_Obj)
      //.json(json_Obj)
    ;
  }
);

app
  .route("/api/latest/imagesearch/")
  .get(
    (req, res, next) => {
    var json_Obj = {
      "error": false//true//'message'
      ,"status": 200// OK
      ,"message": "latest imagesearch requested"
    };

    res
      // 202 Accepted
      // 203 Non-Authoritative Information
      // 204 No Content
      // 302 Found
      .status(200)
      //.send("Custom 200 page. All OK.")
      .jsonp(json_Obj)
      //.json(json_Obj)
    ;
  }
)
;

options = {
  dotfiles: 'ignore'
  // Enable or disable etag generation
  ,etag: false//Default: true
  ,extensions: ['htm', 'html']
  // Let client errors fall-through as unhandled requests,
  // otherwise forward a client error.
  //,fallthrough: true
  ,index: false
  ,maxAge: '1d'
  ,redirect: false
  ,setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
};

// ? so, Middleware work as defaults
// when specific handlers not defined explicitly ?
// Middleware functions are executed sequentially, therefore
//***>>>!!! the order of middleware inclusion is important. !!!<<<***//
//express.static(root, [options])
//app.use(express.static(__dirname + '/'));
//app.use(express.static('public', options));
//app.use(express.static('uploads'));
// TypeError: root path required
//app.use(express.static());

// app.use([path,] function [, function...])
// Mounts the specified middleware function or functions
// at the specified path.
// If path is not specified, it defaults to “/”.
// Note:
// A route will match any path that follows its path immediately with a "/".
// For example: app.use('/apple', ...) will match
// "/apple", "/apple/images", "/apple/images/news", and so on.
/**/
// you need to add a middleware function
// at the very bottom of the stack (below all other functions)
// to handle a 404 response
app
  // a middleware function with no mount path.
  // The function is executed every time
  // the app receives a request.
  .use((req, res, next) => {
    var json_Obj = {
      "error": true//'message'
      ,"status": 404
      ,"message": "Custom 404 page. Sorry cant find that!"
    };

    if (is_Debug_Mode) {console.log('Time:', Date.now());}
    // GET 'http://www.example.com/admin/new'
    // '/admin/new'
    if (is_Debug_Mode) {console.log('Request URL(originalUrl):', req.originalUrl);}
    if (is_Debug_Mode) {console.log("req.baseUrl:", req.baseUrl);} // '/admin'
    if (is_Debug_Mode) {console.log("req.path:", req.path);} // '/new'
    if (is_Debug_Mode) {console.log("req.method", req.method);}
    if (is_Debug_Mode) {console.log("req.params:", req.params);}

    //res.send('Welcome');
    //res.render('special');
    //res.render('index');
    res
      .status(404)
      .jsonp(json_Obj)
      //.send("Custom 404 page. Sorry cant find that!")
      .end()
    ;

    //next();
  }
);
/**/
// define error-handling middleware in the same way as other middleware, except
// with four arguments instead of three;
// specifically with the signature (err, req, res, next):
app
  .use((err, req, res, next) => {
    if (is_Debug_Mode) {console.error("app.use((err)=>", err.stack);}
    var json_Obj = {
      "error": true//'message'
      ,"status": 500
      ,"message": "Custom 500 page. Something broke!"
    };

    res
      .status(500)
      //.send("Custom 500 page. Something broke!")
      .jsonp(json_Obj)
      .json(json_Obj)
      .end()
    ;

    //next();
  }
);
/*##########################################################################*/
/* unit test */
// Start a UNIX socket server 
// listening for connections on the given path.
//http_Server
//app.listen(port, [hostname], [backlog], [callback])
server = app
  .listen(
    port_Number,
    () => {
      var address = server.address();
      var port = server.address().port;
    
      if (is_Debug_Mode) { console.log(
        //"server listening ... address: {", address, "}, port: {", port, "}");}
        "server listening ...", address);}
      //console.log('http_Server listening on port ' + port + '...');
    }
);

// provide both HTTP and HTTPS versions of 'app' with the same code base
//http.createServer(app).listen(80);
//https.createServer(options, app).listen(443);
server
  .on('error',
    (err) => {

      if (err.code == 'EADDRINUSE') {
        console.log('Address in use, retrying...');

        setTimeout(
          () => {
            server.close();
            server
            .listen(
              //PORT,
              //HOST
              //path.join(process.cwd()),
              function () {

                var port = server.address().port;

                console.log("App now running on port:", port);
                console
                .log('express_Server listening on port ' + port + '...');
              }
            );
          },
          1000
        );
      }
    }
);