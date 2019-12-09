const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var promise = require('bluebird');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

const removeOneDocument = function(db, doc, callback) {
    const collection = db.collection('documents');
    collection.deleteOne(doc, function(err, result) {
    if (!err) {
      callback(result);
    } else {
      callback({ err: err });
    }
  });
}

const removeManyDocuments = function(db, doc, callback) {
    const collection = db.collection('documents');
    collection.deleteMany(doc, function(err, result) {
    if (!err) {
      callback(docs);
    } else {
      callback({ err: err });
    }      
  });
}

const findDocuments = function(db, doc, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find(doc).toArray(function(err, result) {
    if (!err) {
      callback(result);
    } else {
      callback({ err: err });
    }
  });
}

const insertOneDocument = function(db, doc, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertOne(doc, function(err, result) {
    if (!err) {
      callback(result);
    } else {
      callback({ err: err });
    }
  });
}

const updateDocument = function(db, doc, callback) {
  var search = doc.search;
  var set = doc.set;
  // Get the documents collection
  const collection = db.collection('documents');
  // Update document
  collection.updateOne(search, { $set: set }, function(err, result) {
    if (!err) {
      callback(result);
    } else {
      callback({ err: err });
    }
  });
}

var execute = function (func, doc) {
  return new promise(function (res, rej) {
  // Use connect method to connect to the server
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
      const db = client.db(dbName);
      func(db, doc, function(result) {
        client.close();
        if (err == null) {
          res(result);
        } else {
          rej(result.err);
        }
      });
    });
  });
}

const update = function (search, set) {
  return new promise(function (res, rej) {
    var doc = { search: search, set: set };
    execute(updateDocument, doc)
      .then(function (r) {
        res(r);
      })
    .catch(function (e) {
      rej(e);
    });
  });
};

const find = function (doc) {
  return new promise(function (res, rej) {
    execute(findDocuments, doc)
      .then(function (r) {
        res(r);
      })
    .catch(function (e) {
      rej(e);
    });
  });
};

const remove = function (doc) {
  return new promise(function (res, rej) {
    execute(removeOneDocument, doc)
      .then(function (r) {
        res(r);
      })
    .catch(function (e) {
      rej(e);
    });
  });
};

const insert = function (doc) {
  return new promise(function (res, rej) {
    execute(insertOneDocument, doc)
      .then(function (r) {
        res(r);
      })
    .catch(function (e) {
      rej(e);
    });
  });
};

module.exports = {
  find: find,
  remove: remove,
  update: update,
  insert: insert
}
