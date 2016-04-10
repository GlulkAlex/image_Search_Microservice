"use strict";
/*** Node.js modules ***/
// a core module
const assert = require('assert');

// npm module
//var
//const MongoClient = require('mongodb').MongoClient;
/*** Node.js modules end ***/

/*** config ***/
// If X.json is a file, parse X.json to a JavaScript Object.
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
const mongoLab_URI = (
  // must be on `.env` file or
  // in heroku config
  // it is possible
  // to use the same config var
  // in both local and Heroku environments
  env.TEST_MONGODB.value ||
  process.env.TEST_MONGODB ||
  process.argv[3] ||
  "mongodb://localhost:27017/data_uri"
);
//*** config end ***//

//*** application modules ***//
//const host_Name_Validator = require('./host_Name_Validator.js');
//const db_Helpers = require('./db_Helpers.js');
//const comparator = require('./comparator.js');
//*** application modules end ***//

//*** helpers ***//
function make_Links_Documents(
  size//:int
)/* => list of obj */ {
  "use strict";

  var result;
  var results = [];
  var loop_Counter = 0;

  for (;loop_Counter < size;loop_Counter++){
    //{"original_url":"original_Link_1","short_url":""}
    // ??? WTF ???
    // DONE : test short_Link_Generator for ''
    results.push(
      {
        "original_url": "original_Link_" + loop_Counter,
        "short_url": link_Gen.get_Short_Link(loop_Counter)
      }
    );
  }

  return results;
}

/*** helpers end ***/


/*** tests ***/
var actual_Results;
var expected_Results;
// case 1:
/* jshint esversion: 6, laxcomma: true */
var test_9_2 = function(description){
  "use strict";
  // curred
  return function(
    url//:str
    ,expected_Result//:list of bool
  )/* => list of bool */ {
    "use strict";
    console.log(description);

    // TODO extract it from GET ["url", "snippet", "context", "thumbnail"]
    // TODO create custom parser function
    // TODO parser must retrieve tags (start/end) for DIV
    // TODO parser must retrieve tag's attribute ("class")
    // TODO parser must retrieve tag's content (.innerHTML)
    // input: data stream / chunks
    // stream processing => ? many accumulators ?
    // output: js object / key => value dictionary

    // https://www.google.ru/search?q=cute+owl&tbm=isch <- term = "cute+owl"
    //<div class="rg_meta">
    //{"cl":6,"id":"JJ6AX2fz8h4wLM:",
    //"isu":"wallpaperswide.com","itg":false,"ity":"jpg",
    //"oh":720, <- image height
    //"ou":"http://wallpaperswide.com/download/cute_owl-wallpaper-1152x720.jpg", <- "url"
    //"ow":1152, <- image width
    //"pt":"Cute Owl HD desktop wallpaper : Widescreen : High Definition ...", <- "snippet"
    //"rid":"2kOGT5u3dPuyQM",
    //"ru":"http://wallpaperswide.com/cute_owl-wallpapers.html", <- "context"
    //"s":"Wide 16:10","th":177,
    //"tu":"https://encrypted-tbn0.gstatic.com/images?q\u003dtbn:ANd9GcRmavtLjp8djM6VjoHB8xr8WOVp8rlsO1Puk4gClrBTZkHR99U8",
    // <- "thumbnail"
    //"tw":284}
    //</div>
    var results = [];
    var result;
    var getter = require('http');
    //var getter = require('https');

    if (url.slice(0, 5) == 'https') {
      url = 'http' + url.slice(5);
    }

    return Promise.resolve(
      getter
        .get(
          url,
          (response) => {
            console.log("Got response:", response.statusCode);
            console.log("headers: ", response.headers);
            var contentType = (
              response.getHeader ? response.getHeader('content-type') : response.headers['content-type']);

            //readable
            //response.resume();
            // `explicitly` convert to `Strings`
            // rather than standard `Buffer` `objects`
            response.setEncoding('utf8');
            response
              .once(
                'data',
                (data) => {
                  // row data Buffer
                  console.log("data:", data);
                }
            );
            //response.end([data][, encoding][, callback])
            //response.body ? console.log("data:", data) : console.log("response.body:", response.body);
            //console.log("response.body:", response.body);

            // An alias of assert.ok()
            // Tests if value is truthy.
            // It is equivalent to -> assert.equal(!!value, true, message).
            assert(response.statusCode < expected_Result);
            //assert.equal(response.statusCode, expected_Result);
            //assert.deepEqual(results, expected_Results);

            //next();

            return contentType;
          }
        )
        .on('error', (err) => {console.log("url getter error:", err.stack);}
      )
    );
  };
}("test 9.2: must receive correct / expected 'statusCode' from response to remote server")
// res.type('.html');              // => 'text/html'
// res.type('html');               // => 'text/html'
// res.get('Content-Type'); => "text/plain"
//("https://soundcloud.com/", 400)
// res.type('json');               // => 'application/json'
// res.type('application/json');   // => 'application/json'
//("https://api-url-shortener-microservice.herokuapp.com/lInK", "application/json")
//("https://api-url-shortener-microservice.herokuapp.com/new/http://expressjs.com/en/4x/api.html#res.type"
//, "application/json")
;

var test_9_1 = function(description){
  "use strict";
  // curred
  return function(
    url//:str
    ,expected_Result//:list of bool
  )/* => list of bool */ {
    "use strict";
    console.log(description);

    var results = [];
    var result;
    var getter = require('https');
    //var express = require('express');
    //var app = express();

    //app.on('mount', callback(parent))
    //app.on('error', (err) => {console.log("express error:", err.stack);});

    return Promise.resolve(
    /*
    app
      // Routes HTTP GET requests (to the running app.listen(port, [hostname], [backlog], [callback]))
      // to the specified path
      // with the specified callback functions.
      .get(
        url,
        function (err, req, res, next) {
          !(err) || console.log("express error:", err.stack);
          result = res.get('Content-Type');
          console.log("res.get('Content-Type'):", result);
          //res.send('GET request to homepage');
          assert(result == expected_Result);
          assert.equal(result, expected_Result);
          //assert.deepEqual(results, expected_Results);
          next();

          return result;
        }
      */
      getter
        .get(
          url,
          (response) => {
            console.log(`Got response: ${response.statusCode}`);
            console.log('headers: ', response.headers);
            var contentType = (
              response.getHeader ? response.getHeader('content-type') : response.headers['content-type']);

            //readable
            //response.resume();
            // `explicitly` convert to `Strings`
            // rather than standard `Buffer` `objects`
            response.setEncoding('utf8');
            response
              .once(
                'data',
                (data) => {
                  // row data Buffer
                  console.log("data:", data);
                }
            );
            //response.end([data][, encoding][, callback])
            //response.body ? console.log("data:", data) : console.log("response.body:", response.body);
            //console.log("response.body:", response.body);

            assert(contentType == expected_Result);
            assert.equal(contentType, expected_Result);
            //assert.deepEqual(results, expected_Results);
            //next();

            return contentType;
          }
        )
        .on('error', (err) => {console.log("url getter error:", err.stack);}
      )
    );
  };
}("test 9.1: must receive correct / expected 'content-type' from response to remote server")
// res.type('.html');              // => 'text/html'
// res.type('html');               // => 'text/html'
// res.get('Content-Type'); => "text/plain"
//("https://api-url-shortener-microservice.herokuapp.com/", "text/html")
// res.type('json');               // => 'application/json'
// res.type('application/json');   // => 'application/json'
//("https://api-url-shortener-microservice.herokuapp.com/lInK", "application/json")
//("https://api-url-shortener-microservice.herokuapp.com/new/http://expressjs.com/en/4x/api.html#res.type"
//, "application/json")
;
/*** tests end ***/

//***#####################################################################***//
/*** unit test (main) ***/
var run_Tests = [
  {"test": 1, "run": 0}
  ,{"test": 2, "run": 0}
  ,{"test": 3, "run": 0}
  ,{"test": 4, "run": 0}
  ,{"test": 5, "run": 1}
];
