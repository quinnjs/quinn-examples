
var Bluebird = require('bluebird');
var _ = require('lodash');

var handler = require('../');

function quickRequest(pathname, expectedCode, opts) {
  var server = null;
  opts = opts || {};

  return new Bluebird(function(resolve, reject) {
    var http = require('http');
    var quinn = require('quinn');

    server = http.createServer(quinn(handler));

    server.listen(function() {
      var addr = this.address();
      var reqOpts = {
        host: 'localhost',
        port: addr.port,
        path: pathname,
        headers: opts.headers || {}
      };
      var req = http.get(reqOpts, function(res) {
        if (expectedCode !== undefined && expectedCode !== res.statusCode) {
          reject(new Error(
            'Expected status code ' + expectedCode +
            ', got ' + res.statusCode));
        }
        var body = '';
        res.on('error', reject);
        res.on('data', function(chunk) { body += chunk.toString('utf8'); });
        res.on('end', function() {
          res.body = body;
          resolve(res);
        });
      }).on('error', reject);
    });
  }).finally(function() {
    if (server !== null)
      try { server.close(); } catch (err) {}
  });
}

module.exports = quickRequest;
