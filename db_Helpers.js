"use strict";
//*** application modules ***//
//const link_Gen = require('./short_link_generator.js');
//const comparator = require('./comparator.js');
//const response_Helpers = require('./response_Helpers.js');
//*** application modules end ***//

// helper
// useless, nothing different form MongoClient.connect
function get_DB(
  mongoLab_URI//: str
  ,MongoClient//: MongoClient obj <- explicit
) {// => Promise(db)
  "use strict";

  var connection = MongoClient.connect(mongoLab_URI);//, function(err, db) {

  // Promise <pending> -> thanble
  //return Promise.resolve(connection.then((db) => {return db;}));
  return connection.then((db) => {return db;});
}

function get_Collection(
  MongoClient//: MongoClient obj <- explicit
  ,mongoLab_URI//: str
  ,collection_Name//: str
  ,db//: obj [db] <- optional
  ,is_Debug_Mode//: bool <- optional
) {//: => Promise({db, collection}) <- contain collection.s.db
  "use strict";

  if (db) {
    return Promise
      .resolve(
        //() => {
          //var collection =
          {
            "db": db,
            "collection": db.collection(collection_Name)
          }

          //return collection;
        //}
    );
  } else {
    // guard
    if (MongoClient) {
      //var connection = MongoClient.connect(mongoLab_URI);//, function(err, db) {
      // guard
      collection_Name = collection_Name ? collection_Name : 'tests';
      //db = Promise.resolve(get_DB(mongoLab_URI));
      //db = Promise.resolve(get_DB(mongoLab_URI).then((dB) => {return dB;}));

      //db.collections(function(err, collections) {
      // ? Promise <pending> ?
      // without .resolve
      // typeof return: undefined
      // something like .flatMap needed ? or just db.close() in the right place ?
      // CORRECT (the function returns a promise, and the caller will handle the rejection)
      // Resolving with `thenables` to flatten nested then() calls
      //return Promise.resolve(
        //connection
          //.then((db) => {return db;})
        //get_DB(mongoLab_URI)
        // same as
        // TypeError: Cannot read property 'connect' of undefined
      return MongoClient
      //  MongoClient
          .connect(mongoLab_URI)
          .then((db) => {
          // defined `this` does not make any changes on `pending`
          //.then(function(db) {
              // Create a collection we want to drop later
              // Returns:
              // the new Collection instance if not in strict mode
              //db.collection('test_correctly_access_collections', {strict:true}, function(err, col3) {
              //var collection = db.collection(collection_Name);

              // not helping, still having
              // return: Promise { <pending> }
              //return Promise.resolve(collection);
              ///return Promise.resolve((c) => {return c;});
              //return collection;
              /*
              // works but give the same results / behaviour as before / above
              return db
                .collection(
                  collection_Name
                  //, {strict:true}
                  , function(err, col) {
                    if (err) {
                      return Promise.reject(err);
                    } else {
                      return Promise.resolve(col);
                    }
                  }
              );
              */
              /*
              // works but give the same results / behaviour as before / above
              return new Promise(
                function(resolve, reject) {
                  db
                  .collection(
                    collection_Name
                    //, {strict:true}
                    , function(err, col) {
                      if (err) {
                        reject(err);
                      } else {
                        resolve(col);
                      }
                  });
              });
              */
              return Promise.resolve({
                "db": db,
                "collection": db.collection(collection_Name)
              });
              //return Promise.resolve(db.collection(collection_Name));
              //return db.collection(collection_Name);
            }
          ).catch((err) => {
            if (is_Debug_Mode) {console.log("connection err:", err.stack);}

            return Promise.reject(err);
          }
        )
        // work, but changes nothing
        //.then((collection) => {return collection;})
        // TypeError: db.collection is not a function
        //db.collection(collection_Name)
      //)
      ;
    } else {
      var message = "missing MongoClient argument";

      if (is_Debug_Mode) {console.log(message);}

      return Promise.reject(new Error(message));
    }
  }
}

function clear_Links(
  mongoLab_URI//: str
  ,collection_Name//: str
  ,MongoClient//: MongoClient obj <- explicit
){// => Promise(db)
  "use strict";

  if (MongoClient) {
    var connection = MongoClient.connect(mongoLab_URI);//, function(err, db) {
    collection_Name = collection_Name ? collection_Name : 'tests';

    // Promise <pending> -> thanble
    return Promise.resolve(
      connection
        .then((db) => {
          // Create a collection we want to drop later
          // Returns:
          // the new Collection instance if not in strict mode
          //var collection = db.collection(collection_Name);
          //var collection =
          db.collection(
            collection_Name,
            {strict: true},
            (err, col) => {
              if (err) {
                console.log("collection:", collection_Name, " not exist in db");
                console.log("nothing to drop from db");
                // ? close it outside in .then() ?
                // this is important as it affects next actions
                //db.close();

                //return undefined;
                return db;
              } else {
                console.log("collection:", collection_Name, " exist in db");
                console.log("collection:", collection_Name, " about to drop from db");
                // Drop the collection
                //var drop = collection.drop();//function(err, reply) {
                var drop = db.dropCollection(collection_Name);//, function(err, result) {

                drop
                  .then((reply) => {
                    // Verify that the collection is gone
                    //db.listCollections({name:collection_Name}).toArray().then((names) => {
                    //  assert.equal(0, names.length);
                    console.log("drop reply is:", reply);
                    // Let's close the db
                    // connection err: undefined
                    //db.close();
                    return db;
                  }
                  ).catch((err) => {
                      // MongoError: ns not found
                      if (db) {
                        //db.close();
                        return db;
                      }

                      return console.log("drop err:", err.stack);
                    }
                );

                //return col;
              }
            }
          );

          //return db;
        }
        ).catch((err) => {console.log("connection err:", err.stack);}
      )
    );
  } else {
    return Promise.resolve(console.log("missing MongoClient argument"));
  }
};

// helper
/** must:
* - check for collection existence in db (mongo can do it automatically by default)
* - if not in db create one explicitly
* - check for collection time_Stamp index existence
* - if not exist create one explicitly
*/
/* jshint esversion: 6, laxcomma: true */
/* somehow it works */
function create_Index(
  mongo_Client//: MongoClient obj <- explicit
  ,mongoLab_URI//:str
  ,collection_Name//:str
  //collection//: obj [collection]
  // index
  ,field_Name//:str
  ,is_Debug_Mode//: bool <- optional
) {//: => Promise
  "use strict";

  //var collection = get_Collection(
  //  mongoLab_URI,//:str
  //  collection_Name ? collection_Name : 'tests'//:str
  //);
  if (
    mongo_Client &&
    mongoLab_URI &&
    //collection &&
    collection_Name &&
    field_Name &&
    typeof(mongoLab_URI) == 'string' && mongoLab_URI.length > 0 &&
    typeof(collection_Name) == 'string' && collection_Name.length > 0 &&
    typeof(field_Name) == 'string' && field_Name.length > 0
  ) {
    if (is_Debug_Mode) {console.log("creating index for", field_Name, "field in", collection_Name);}

    var field_Spec = {};
    // value of 1 specifies an index that orders items in `ascending` order.
    // A value of -1 specifies an index that orders items in `descending` order.
    //>>> for return docs with latest date
    //>>> order must be `descending` -> latest first (not oldest)
    var index_Sort_Order = -1;

    field_Spec[field_Name] = index_Sort_Order;
    //var db = collection.s.db;
    mongo_Client
      .connect(mongoLab_URI)
      .then((db) => {
        //>>> pending here
        if (is_Debug_Mode) {console.log("Checking if exist collection:", collection_Name, "...");}
        // Grab a collection with a callback in `safe mode`,
        // ensuring it exists (should fail if it is not created)
        var collection_Promise = Promise
          .resolve(
            db
            .collection(collection_Name
              ,{"strict": true}
              ,(err, collection) => {

                if (err) {
                  if (is_Debug_Mode) {console.log("typeof(err):", typeof(err));}
                  // err.toString():
                  // MongoError: Collection image_search_results does not exist. Currently in strict mode.
                  if (is_Debug_Mode) {console.log("err.toString():", err.toString());}
                  // err.code: undefined
                  //if (is_Debug_Mode) {console.log("err.code:", err.code);}

                  //if (is_Debug_Mode) {console.log("closing db ...");}
                  //db.close();

                  return Promise.reject(err);
                }

                if (is_Debug_Mode) {console.log("typeof(collection):", typeof(collection));}
                //if (is_Debug_Mode) {console.log("collection.toString():", collection.toString());}
                if (is_Debug_Mode) {console.log("String(collection):", String(collection));}
                if (is_Debug_Mode) {console.log("collection.name:", collection.name);}


                return Promise
                  .resolve(
                    //{"then": collection}
                    collection
                  )
                ;
              }
            )
          )
        ;
        if (is_Debug_Mode) {console.log("typeof(collection_Promise):", typeof(collection_Promise));}
        if (is_Debug_Mode) {
          console.log("is collection_Promise instanceof Promise:", collection_Promise instanceof Promise);}
        // collection_Promise.hasOwnProperty("then"): false
        if (is_Debug_Mode) {
          console.log("collection_Promise.hasOwnProperty(\"then\"):", collection_Promise.hasOwnProperty("then"));}

        collection_Promise
          .then((collection) => {
              if (is_Debug_Mode) {console.log("collection:", collection_Name, "already exist");}
              //collection.indexExists(indexes, callback) => {Promise}
              collection
                // TypeError: Cannot read property 'indexExists' of undefined
                .indexExists(field_Name + "_" + index_Sort_Order)
                .then((result) => {
                  if (is_Debug_Mode) {console.log("collection.indexExists(result):", result);}

                  if (db) {if (is_Debug_Mode) {console.log("closing db");}db.close();}
                })
                .catch((err) => {
                  if (is_Debug_Mode) {
                    console.log(
                      "collection.indexExists(", field_Name + "_" + index_Sort_Order, ").catch(error):",
                      err.message);}
                  if (is_Debug_Mode) {console.log(err.stack);}
                  // Create an index on the a field
                  collection
                    .createIndex(
                      field_Spec
                      //{field_Name: 1}// <- obj literal failed, `field_Name` was not substituted by its value
                      //"{" + field_Name + ": 1}"//: str <- wrong syntax
                      //field_Name//: str
                      ,{
                        //"unique": true
                        "background": true
                        ,"w": 1
                      }
                    )
                    .then((index_Name) => {
                        if (is_Debug_Mode) {console.log("indexName:", index_Name, "for", field_Name, "field created");}

                        if (db) {if (is_Debug_Mode) {console.log("closing db");}db.close();}

                        //return collection;// ? for further .then() ?
                        //return indexName;
                      }
                    ).catch((err) => {
                        if (is_Debug_Mode) {console.log("collection.createIndex( err:", err.message);}
                        if (is_Debug_Mode) {console.log(err.stack);}

                        if (db) {if (is_Debug_Mode) {console.log("closing db");}db.close();}
                        //return err;
                      }
                    )
                  ;
                })
              ;
              //return Promise.resolve(collection);
            }
          )
          .catch((err) => {
            if (is_Debug_Mode) {console.log("db.collection(", collection_Name, ").catch(error):", err.message);}
            if (is_Debug_Mode) {console.log(err.stack);}
            //createCollection(name, options, callback) => {Promise}
            // Create the collection
            //return
            db
              .createCollection(collection_Name)
              .then((collection) => {
                if (is_Debug_Mode) {console.log("collection:", collection_Name, "created");}
                //db.createIndex(name, fieldOrSpec, options, callback) => {Promise}
                db
                  .createIndex(collection_Name
                    ,field_Spec
                  )
                  .then((result) => {
                    if (is_Debug_Mode) {console.log("db.createIndex(result):", result);}
                    if (db) { if (is_Debug_Mode) {console.log("closing db");} db.close();}
                  })
                  .catch((err) => {
                    if (is_Debug_Mode) {
                      console.log("db.createIndex(", collection_Name, field_Name, ").catch(error):", err.message);}
                    if (is_Debug_Mode) {console.log(err.stack);}
                  })
                ;
              })
              .catch((err) => {
                if (is_Debug_Mode) {
                  console.log("db.createCollection(", collection_Name, ").catch(error):", err.message);}
                if (is_Debug_Mode) {console.log(err.stack);}
                if (db) { if (is_Debug_Mode) {console.log("closing db");} db.close();}
                }
              )
            ;
          })
        ;
      })
    ;


    //return Promise.resolve();
  } else {
    if (is_Debug_Mode) {console.log("one of input parameters is undefined ?:", collection_Name, field_Name);}
  }
};

// helper
function add_Docs(
  //mongoLab_URI//:str
  documents//:list of obj
  //,collection_Name//:str
  ,collection//: obj [collection]
){// => Promise(result)
  "use strict";

  console.log("typeof collection:", (typeof collection));
  // collection instanceof Promise: false
  console.log("collection instanceof Promise:", (collection instanceof Promise));
  var collection_Name = collection.s.name;
  var db = collection.s.db;
  //var collection = get_Collection(
  //  mongoLab_URI//:str
  //  ,(collection_Name ? collection_Name : 'tests')//:str
  //);

  // ? Promise <pending> ?
  return Promise.resolve(
    collection
      // bulkWrite(operations, options, callback) => {Promise}
      // ordered	boolean	true
      // bulk_results.nInserted
      // bulk_results.insertedCount
      // insertMany err: undefined
      // ReferenceError: collection_Name is not defined
      // ? no { ordered: false } ?
      //.insertMany(
      .bulkWrite(
        documents
        ,{ ordered: false }
      )//, function(err, r) {
      .then((result) => {
            console.log("added:", result.insertedCount, "documents to ", collection_Name);
            // Let's close the db
            db.close();


            //return Promise.resolve(result);
            return result;
          }
        ).catch((err) => {
            // MongoError: ns (name space -> <db.collection>) not found
            // MongoError: E11000 duplicate key error index:
            // sandbox_mongo-db_v3-0.tests.$field_Name_1 dup key: { : null }
            console.log("insertMany err:", err.code);
            // MongoError: write operation failed

            // this cancel pending
            if (db) {db.close();}

            return console.log(err.stack);
          }
      )
  );
};

// helper
function bulk_Docs_Insert(
  MongoClient//: MongoClient obj <- explicit
  ,mongoLab_URI//: str
  ,collection_Name//: str
  //,collection//: obj [collection]
  ,documents//:list of obj
){// => Promise(result)
  "use strict";

  collection_Name = collection_Name ? collection_Name : 'tests';
  if (
    MongoClient && mongoLab_URI && collection_Name && documents
    //(MongoClient instanceof MongoClient)
    && typeof(mongoLab_URI) == 'string' && mongoLab_URI.length > 0
    && Array.isArray(documents) // || ([] instanceof Array)
    && documents.length > 0
  ) {
    var connection = MongoClient.connect(mongoLab_URI);//, function(err, db) {

    // Promise <pending> -> thanble <- no by able close db eventually
    return Promise.resolve(
      connection
        .then((db) => {
          // the new Collection instance if not in strict mode
          var collection = db.collection(collection_Name);

          return Promise.resolve(
            collection
              // bulkWrite(operations, options, callback) => {Promise}
              // ordered	boolean	true
              // bulk_results.nInserted
              // bulk_results.insertedCount
              .bulkWrite(
                documents
                ,{ ordered: false }
                //,{ ordered: true }
                //,{forceServerObjectId: true}
              )//, function(err, r) {
              .then((result) => {
                    console.log("added:", result.insertedCount, "documents to ", collection_Name);
                    // Let's close the db
                    console.log("closing db");
                    db.close();
                    //return db ? db : result;
                  }
              ).catch((err) => {
                  console.log("bulkWrite.then() err:", err.code);
                  console.log(err.stack)
                  if (db) {
                    console.log("db defined:");
                    console.log("closing db");
                    db.close();
                    //return db;
                  } else {
                    console.log("db undefined:");
                    //return err;
                  }
                }
            )
          );
        }
      ).catch((err) => {
          console.log("connection.then() err:", err.code);
          console.log(err.stack);
          //return err;
        }
      )
    );
  } else {
    console.log("some mandatory parameters are undefined or have the wrong type");
  }
};

// helper
// send_JSON_Response inside -> is not good (overload & against concern separation)
// no need to do it inside
// as all parameters passed from outside
function insert_Link_To_DB(
  db//: mongoDB obj <- optional == collection.s.db;
  ,collection//: mongoDB obj
  ,document_Obj//: dict
  //request,//: HTTP(S) obj <- ? optional ?
  //,response//: HTTP(S) obj
  //,json_Response_Obj//: dict <- ? optional ?
  //host, //protocol + // + host_name
  //source_Link,// str <- optional
  //,context_Message//: str <- optional
  ,is_Debug_Mode//: bool <- optional
) {//: => thenable Promise => ((null | void | Unit) | error)
  "use strict";
  //const
  //var response_Helpers = require('./response_Helpers.js');
  var collection_Size = 0;
  //var short_Link; // = "";// = document_Obj.short_Link
  //var source_Link;
  //var json_Response_Obj = {};
  var message = "? error message ?";

  //*** positional arguments ***//
  //*** defaults ***//
  //document_Obj = document_Obj ? document_Obj : {};
  //json_Response_Obj = json_Response_Obj ? json_Response_Obj : {};
  /*
  if (context_Message) {
  } else {
    context_Message = "request.on 'end' query.allow insertOne";
  }
  */
  //if (is_Debug_Mode) {console.log('db:', db);}
  if (is_Debug_Mode) {console.log('db == null or undefined:', (db == null || db == undefined));}
  if (is_Debug_Mode) {console.log('typeof db:', typeof(db));}
  if (db) {} else {
    db = collection.s.db;
    //if (is_Debug_Mode) {console.log('collection.s.db:', db);}
    if (is_Debug_Mode) {console.log(
      'db == null or undefined:', (db == null || db == undefined));}
  }
  //*** defaults end ***//

  // guard
  // currently fires before link was generated
  if (document_Obj.short_url) {
    var short_url = document_Obj.short_url;

    if (is_Debug_Mode) {console.log('short_url:', short_url, "provided");}

  } else {
    message = 'undefined / empty document_Obj.short_url';

    /* finally */
    if (db) {
      db.close();
      if (is_Debug_Mode) {console.log("Close db after link insert");}
    }
    if (is_Debug_Mode) {console.log(message);}
    //new Error(message)
    return Promise.reject(new Error(message));
  }


  //return Promise
  //  .resolve(() => {
  ///  .resolve(
  return collection
  //      collection
          // insertOne(doc, options, callback) => {Promise}
          .insertOne(
            document_Obj
            //JSON.stringify(document_Obj)
          )
          .then((result) => {//.result.n
              //console.log(JSON.stringify(document_Obj));
              if (is_Debug_Mode) {console.log('inserted document_Obj: %j', document_Obj);}
              if (is_Debug_Mode) {console.log("result.result.n:", result.result.n);}
              //console.log('result.result: %j', result.result);

              /* finally */
              if (db) {
                db.close();
                if (is_Debug_Mode) {console.log("Close db after link insert(ion/ed)");}
              }

              return Promise.resolve(result.result.ok);
            }
          )
          .catch((err) => {
              // "E11000 duplicate key error index:
              // links.$original_url_text_short_url_text dup key: { : \"com\", : 0.625 }
              if (is_Debug_Mode) {console.log('(collection / cursor).insertOne() error:', err.stack);}
              /* finally */
              if (db) {
                db.close();
                if (is_Debug_Mode) {console.log("Close db after insertOne().catch()");}
              }

              return Promise.reject(err);
            }
        );
    //}()
  //);

  //return //null;//side effect //void //Unit
}

/* jshint esversion: 6, laxcomma: true */
function find_Recent_Docs(
  MongoClient//: MongoClient obj <- explicit
  ,mongoLab_URI//: str
  ,connection//: MongoClient.connect obj <- optional
  ,db//: MongoClient.connect.then() obj <- optional
  ,collection//: db.collection obj <- optional
  ,collection_Name//: str
  ,limit//: int
  ,is_Debug_Mode//: bool <- optional
) {//: => Promise | thenable (list of (dict | obj) | undefined | error)
  "use strict";

  var result;
  var documents;//: list of obj
  var query = {};//: query obj
  var results = [];

  // most parameters are from super / parent scope
  function actual_Result(
    db//: MongoClient.connect.then() obj
    ,collection//: db.collection obj <- optional
    ,collection_Name//: str
    ,query//: obj
  ) {//: => Promise | thenable ((dict | obj) | undefined | error)
    if (collection) {
      if (is_Debug_Mode) {console.log("using passed collection parameter");}
    } else {
      collection = db
        .collection(collection_Name);
    }

    return collection
      .find(
        query
      )
      .project({"_id": false, "original_url": true, "short_url": 1})
      .toArray()
      .then((docs) => {
          if (is_Debug_Mode) {console.log("documents found:", docs.length);}
          if (is_Debug_Mode) {console.log(docs);}
          if (is_Debug_Mode) {
            // Logging property names and values using Array.forEach
            Object
              //.getOwnPropertyNames(obj)
              .keys(docs)
              .forEach((val, idx, array) => {
              //!(is_Debug_Mode) ||
              console.log(
                val, '->', docs[val]);
            });
          }
          //*** find original_Link in docs ***//
          //var filtered = arr.filter(func);
          results = docs.filter((doc) => {return doc.original_url == original_Link;});
          if (results.length > 0) {
            result = {"document": results[0], "is_New": false};//, "db": db};
          } else {
            //*** find Arrays / lists difference ***//
            documents = [];
            documents.push({"original_url": original_Link, "short_url": short_Links[0]});
            documents.push({"original_url": original_Link, "short_url": short_Links[1]});
            documents.push({"original_url": original_Link, "short_url": short_Links[2]});
            documents.push({"original_url": original_Link, "short_url": short_Links[3]});

            results = comparator.lists_Difference(
              documents//: list (of obj)
              ,docs//: list (of obj)
              ,is_Debug_Mode
            );
            result = results.hasOwnProperty(0) ? results[0] : result;
            result = {"document": result, "is_New": true};//, "db": db};
          }
          if (is_Debug_Mode) {console.log("result", result);}
          result.db = db;
          //db.close();

          return Promise.resolve(
            result
          );
        }
      )
      .catch((err) => {
        if (is_Debug_Mode) {console.log("cursor.then():", err.stack);}
        return Promise.reject(err);
      }
    );
  }
  //!(env.DEBUG_MODE.value) || console.log("mongoLab_URI is:", mongoLab_URI);
  if (is_Debug_Mode) {console.log("short_Link_Size:", short_Link_Size);}

  // prepossessing
  short_Links.push(link_Gen.get_Short_Link(short_Link_Size));//, null, env.DEBUG_MODE.value));
  short_Links.push(link_Gen.get_Short_Link(short_Link_Size));
  short_Links.push(link_Gen.get_Short_Link(short_Link_Size));
  short_Links.push(link_Gen.get_Short_Link(short_Link_Size + 1));

  // one "original_url"
  // many "short_url"
  query = {
    $or: [
      {
        "original_url": original_Link
      }
      ,{
        "short_url": {
          $in: [
            short_Links[0]
            ,short_Links[1]
            ,short_Links[2]
            ,short_Links[3]
          ]
        }
      }
    ]
  };
  if (is_Debug_Mode) {console.log("query: %j", query);}
  if (is_Debug_Mode) {console.log("typeof(db):", typeof(db));}
  if (is_Debug_Mode) {console.log("db instanceof Promise:", (db instanceof Promise));}
  if (is_Debug_Mode) {console.log("typeof(collection)", typeof(collection));}
  if (is_Debug_Mode) {console.log("collection instanceof Promise:", (collection instanceof Promise));}

  if (db) {
  //if (db && collection) {
    if (is_Debug_Mode) {console.log("using passed db parameter");}

    return actual_Result(
      db//: MongoClient.connect.then() obj
      ,collection//: db.collection obj <- optional
      ,collection_Name//: str
      ,query//: obj
    );
  } else {
    if (connection) {} else {
      connection = MongoClient.connect(mongoLab_URI);//, function(err, db) {
    }
    //return Promise.resolve(connection
    return connection
      .then((db) => {
          // the new Collection instance if not in strict mode
          //var collection = db.collection(collection_Name);
          //var cursor = collection

          // non-interrupted chain of returns needed
          // to obtain / gain Promise | thenable
          // as return value
          //return collection
          return actual_Result(
            db//: MongoClient.connect.then() obj
            ,collection//: db.collection obj <- optional
            ,collection_Name//: str
            ,query//: obj
          );
        }
      )
      .catch((err) => {
        if (is_Debug_Mode) {console.log("connection.then():", err.stack);}
        return Promise.reject(err);
      }
      //)
    );
  }
}

/*##########################################################################*/
exports.clear_Links = clear_Links;
exports.get_Collection = get_Collection;
exports.create_Index = create_Index;
exports.add_Docs = add_Docs;
exports.insert_Link_To_DB = insert_Link_To_DB;
exports.find_Recent_Docs = find_Recent_Docs;