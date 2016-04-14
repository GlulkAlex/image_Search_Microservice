"use strict";
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
const is_Debug_Mode = (
  process.env.IS_DEBUG ||
  env.DEBUG_MODE.value ||
  process.argv[2]
  //true
  //false
);
//*** config end ***//

/*** Node.js modules ***/
// a core module
const assert = require('assert');

// npm module
//var
const mongo_Client = require('mongodb').MongoClient;
/*** Node.js modules end ***/

//*** application modules ***//
//const host_Name_Validator = require('./host_Name_Validator.js');
const db_Helpers = require('./db_Helpers.js');
const html_Parser = require('./html_Parser.js');
//*** application modules end ***//

//*** helpers ***//
function helper(
  params//:int
) {// => list of obj
  "use strict";

  var result;
  var results = [];

  return results;
}

/*** helpers end ***/


/*** tests ***/
var actual_Results;
var expected_Results;
// case 1:
/* jshint esversion: 6, laxcomma: true */
var test_1_0 = function(description){
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
            var content_Type;

            console.log("Got response:", response.statusCode);

            if (response.hasOwnProperty("getHeader")) {
              content_Type = response.getHeader('content-type');
            } else {
              content_Type = response.headers['content-type'];
            }

            console.log("content_Type:", content_Type);
            console.log("headers: ", response.headers);

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

            return content_Type;
          }
        )
        .on('error', (err) => {console.log("url getter error:", err.stack);}
      )
    );
  };
}("test 1.0: must receive correct / expected 'statusCode' from response to remote server")
// res.type('.html');              // => 'text/html'
// res.type('html');               // => 'text/html'
// res.get('Content-Type'); => "text/plain"
//("https://www.google.ru/search?q=cute+owl&tbm=isch", 400)
// res.type('json');               // => 'application/json'
// res.type('application/json');   // => 'application/json'
;

var test_1_1 = function(description){
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
            var content_Type;

            console.log("Got response:", response.statusCode);

            //content_Type.split(";")[0]
            if (response.hasOwnProperty("getHeader")) {
              content_Type = response.getHeader('content-type');
            } else {
              content_Type = response.headers['content-type'];
            }
            content_Type = content_Type.split(";")[0];

            console.log("content_Type:", content_Type);
            console.log("headers: ", response.headers);

            //readable
            //response.resume();
            // `explicitly` convert to `Strings`
            // rather than standard `Buffer` `objects`
            response.setEncoding('utf8');
            response
              // for big page => only 1st chunk will be returned
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

            //'content-type': 'text/html; charset=windows-1251',
            //assert(content_Type == expected_Result);
            assert.equal(content_Type, expected_Result);
            //assert.deepEqual(results, expected_Results);
            //next();

            return content_Type;
          }
        )
        .on('error', (err) => {console.log("url getter error:", err.stack);}
      )
    );
  };
}("test 1.1: must receive correct / expected 'content-type' from response to remote server")
// res.type('.html');              // => 'text/html'
// res.type('html');               // => 'text/html'
// res.get('Content-Type'); => "text/plain"
//("https://www.google.ru/search?q=cute+owl&tbm=isch", 'text/html')
// res.type('json');               // => 'application/json'
// res.type('application/json');   // => 'application/json'
;

var test_1_2 = function(description){
  "use strict";
  // curred
  return function(
    url//:str
    ,expected_Result//:int
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
            var content_Type;
            var extracted_Tags = [];
            var result_Obj = {};
            var parser_State;
            var last_Data_Chunk = "";
            // str is too short for that
            var page_Content = new Buffer("");
            var total_Length = page_Content.length;
            var data_Chunk;// = new Buffer("");
            var has_DIV_Tag_Meta = false;
            //'<div class="rg_meta">'
            //<div class=gbm <- WTF ? where are "" or '' ?
            var div_Tag_Meta_Chunk = "";

            console.log("Got response:", response.statusCode);

            //content_Type.split(";")[0]
            if (response.hasOwnProperty("getHeader")) {
              content_Type = response.getHeader('content-type');
            } else {
              content_Type = response.headers['content-type'];
            }
            content_Type = content_Type.split(";")[0];

            console.log("content_Type:", content_Type);
            console.log("headers: ", response.headers);

            //readable
            //response.resume();
            // `explicitly` convert to `Strings`
            // rather than standard `Buffer` `objects`
            response.setEncoding('utf8');
            response
              // for big page => only 1st chunk will be returned
              .on(
              //.once(
                'data',
                (data) => {
                  // row data Buffer
                  //console.log("data:", data);
                  //console.log("typeof(data): ", typeof(data), "data.length: ", data.length);
                  if (has_DIV_Tag_Meta) {} else {
                    // TODO it seems like page data & page view is not the same
                    // some client side magic goes here
                    //if (data.indexOf('https://encrypted-tbn3.gstatic.com') == -1) {
                    //if (data.indexOf('><a href="/url?q=') == -1) {
                    if (data.indexOf('<cite title=') == -1) {
                    //if (data.indexOf('Owl Logo Design - Lo') == -1) {
                    } else {
                      has_DIV_Tag_Meta = true;
                      div_Tag_Meta_Chunk = data;
                    }
                  }
                  if (extracted_Tags.length < expected_Result) {
                    //console.log("extracting ...");
                    console.log("extracting ... typeof(data): ", typeof(data), "data.length: ", data.length);
                    result_Obj = html_Parser
                      .parse_HTML(
                        data//: str
                        ,extracted_Tags//: obj | dictionary
                        // it must change over time
                        ,parser_State
                        //,is_Debug_Mode
                    );

                    extracted_Tags = result_Obj.extracted_Tags;
                    parser_State = result_Obj.parser_State;
                  }
                  last_Data_Chunk = data;
                  //page_Content += data;
                  data_Chunk = Buffer.from(data);
                  page_Content = Buffer.concat([page_Content, data_Chunk], page_Content.length + data_Chunk.length);
                }
            );

            //response.end([data][, encoding][, callback])
            //response.body ? console.log("data:", data) : console.log("response.body:", response.body);
            //console.log("response.body:", response.body);
            response
              .once(
                'end',
                () => {
                  console.log("extracted_Tags.length: ", extracted_Tags.length);
                  console.log("extracted_Tags: ", extracted_Tags);
                  console.log("last_Data_Chunk: ", last_Data_Chunk);
                  console.log("div_Tag_Meta_Chunk: ", div_Tag_Meta_Chunk);
                  console.log("page_Content: ");
                  //console.log(page_Content.slice(-500));
                  console.log("page_Content.length:", page_Content.length);
                  // buf.toString('utf8',0,5);
                  //console.log(page_Content.toString('utf8', 55000, 57500));
                  //'content-type': 'text/html; charset=windows-1251',
                  //assert(content_Type == expected_Result);
                  assert.equal(extracted_Tags.length, expected_Result);
                  //assert.deepEqual(results, expected_Results);
                  //next();

                  return extracted_Tags;
                }
              )
            ;

            response.on('error', (err) => {console.log("response.on('error')", err.message);});

          }
        )
        .on('error', (err) => {console.log("url getter error:", err.stack);}
      )
    );
  };
}("test 1.1: must extract content of DIV with specific class, from response from remote server")
//("https://www.google.ru/search?q=cute+owl&tbm=isch", 3)
/*
the Chrome Instant feature
---
Instant Extended allows
Instant URLs to
match more template fields
of the default search engine, with restrictions.
So, in the extended mode,
"https://www.google.com/?espv=1" and
"https://www.google.com/search?espv=1&q=foo" are also Instant URLs,
whereas
the corresponding URLs
without the "espv=1" parameter are not.
*/
//"search_url":
//"{google:baseURL}search?q={searchTerms}
//&{google:RLZ}
//{google:originalQueryForSuggestion}
//{google:assistedQueryStats}
//{google:searchFieldtrialParameter}
//{google:iOSSearchLanguage}
//{google:searchClient}
//{google:sourceId}
//{google:instantExtendedEnabledParameter}
//{google:contextualSearchVersion}ie={inputEncoding}"
("https://www.google.ru/search?q=fox&espvd=1&tbm=isch&site=imghp", 3)
//("https://www.google.ru/search?q=wise+dig&espv=2&tbs=isz:m,ic:gray,itp:lineart&tbm=isch", 3)
//("https://www.google.ru/search?q=wise+dig&espvd=1&tbs=isz:m,ic:gray,itp:lineart&tbm=isch", 3)
//("https://www.google.ru/search?q=wise+owl&espv=2&source=lnms&tbm=isch", 3)
//("https://www.google.ru/search?q=wise+owl&newwindow=1&espv=2&biw=1280&bih=663&source=lnms&tbm=isch", 3)
// 302 Moved -> redirect to .ru
//("https://www.google.com/search?site=imghp&tbm=isch&source=hp&q=fox&oq=fox", 3)
//("https://www.google.com/search?q=cute+owl&tbm=isch", 3)
//("https://www.google.ru/search?q=cute+owl&tbm=isch#newwindow=1&tbm=isch&q=cute+owl", 3)
;

/* somehow it works */
var test_2_0 = function(description){
  "use strict";
  // curred
  return function(
    collection_Name//:str
    ,field_Name//:str
    //,expected_Result//:list of bool
  ) {// => ? list of bool ?
    "use strict";
    console.log(description);

    var results = [];
    var result;
    //var getter = require('https');

    return Promise.resolve(
      db_Helpers
        .create_Index(
          mongo_Client//: MongoClient obj <- explicit
          ,mongoLab_URI//:str
          ,collection_Name//:str
          //collection//: obj [collection]
          // index
          ,field_Name//:str
          ,is_Debug_Mode//: bool <- optional
        )
    )
    ;
  };
}("test 2.0: must create collection if non-exist & specific index in it if non-exist")
//("image_search_results", "when")
;

var test_3_0 = function(description){
  "use strict";
  // curred
  return function(
    data_Chunks//: list of str
    //,expected_Result//:list of bool
  ) {// => ? list of bool ?
    "use strict";
    console.log(description);

    var results_List = [];
    var result_Obj = {};
    var result = "";
    var extracted_Tags = [];//{};
    var current_Tag = "";
    var incomplete_Data = "";
    var parser_State;// = {};

    //var list_Index = 0;
    result_Obj.extracted_Tags = extracted_Tags;
    result_Obj.current_Tag = current_Tag;
    result_Obj.incomplete_Data = incomplete_Data;
    //for () {}
    data_Chunks
      .forEach((item, index, data_Chunks) => {//: => void

          result_Obj = html_Parser
            .parse_HTML(
              item//: str
              ,extracted_Tags//: obj | dictionary
              // it must change over time
              ,parser_State
              //,is_Debug_Mode
          );

          extracted_Tags = result_Obj.extracted_Tags;
          parser_State = result_Obj.parser_State;

          //return null;//: => void
        }
        ,parser_State
      )
    ;
    console.log("result:", result_Obj);


    return null;//: => void
  };
}("test 3.0: must parse HTML & return DIV innerHTML as object / dictionary ")
/*([
  "<di"
  ,'v class="rg_meta">' +
    '{"cl":6,"id":"JJ6AX2fz8h4wLM:",' +
    '"isu":"wallpaperswide.com","itg":false,"ity":"jpg",' +
    '"oh":720,' + // <- image height
    '"ou":"http://wallpaperswide.com/download/cute_owl-wallpaper-1152x720.jpg",' + // <- "url"
    '"ow":1152,' + // <- image width
    '"pt":"Cute Owl HD desktop wallpaper : Widescreen : High Definition ...",' + // <- "snippet"
    '"rid":"2kOGT5u3dPuyQM",' +
    '"ru":"http://wallpaperswide.com/cute_owl-wallpapers.html",' + // <- "context"
    '"s":"Wide 16:10","th":177,' +
    '"tu":"https://encrypted-tbn0.gstatic.com/' +
    'images?q\u003dtbn:ANd9GcRmavtLjp8djM6VjoHB8xr8WOVp8rlsO1Puk4gClrBTZkHR99U8",' +// <- "thumbnail"
    '"tw":284}' +
    '<'
  ,"/div>"
])*/
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
