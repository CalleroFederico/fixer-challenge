const https = require('http');
var promise = require('bluebird');

var getFixerData = function () {
  return new promise (function (res, rej) {
    var queryString = 'http://data.fixer.io/api/latest?access_key=ffcc344a3f31700c0020d166fd17ea96';
    https.get(queryString, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        res(data);
      });
    }).on("error", (err) => {
      rej(err.message);
    });
  });
};

module.exports = {
  getFixerData: getFixerData
}

