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
var express = require('express');
var app = express();
// for correct connection using .env
// use `heroku local` or `heroku open [<url.path>]`
const mongo = require('mongodb').MongoClient;

//*** application modules ***//
// exports.get_Short_Link = short_Link_Generator;
const short_Link_Gen = require('./short_link_generator.js');//.short_Link_Generator;
//var link_Gen = short_Link_Gen;
const host_Name_Validator = require('./host_Name_Validator.js');
const db_Helpers = require('./db_Helpers.js');
const response_Helpers = require('./response_Helpers.js');
//*** application modules end ***//

// redundant here, has no practical use
const end_Points_List = [
  "/"
  ,"/new" // special entry point
  //,"/home",
  //,"/help",
  //,"/info"
];

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
  http
  //https
);
var response_Body; 
var source_Link = "";
var links_Count = 0;


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
  if (mongo.hasOwnProperty("define")) {
    console.log("mongo.define.name:", mongo.define.name);
  } else {
    console.log("typeof mongo:", typeof(mongo));
  }
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


/*##########################################################################*/
/* unit test */
// Start a UNIX socket server 
// listening for connections on the given path.
http_Server
  .listen(
    port_Number,
    () => {
      var address = http_Server.address();
      var port = http_Server.address().port;
    
      console.log(
        `server listening address{${address.address}}:port{${address.port}}`
      );
      //console.log('http_Server listening on port ' + port + '...');
    }
);

// provide both HTTP and HTTPS versions of 'app' with the same code base
//http.createServer(app).listen(80);
//https.createServer(options, app).listen(443);
