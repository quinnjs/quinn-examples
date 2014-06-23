'use strict';

var QS = require('querystring');
var Http = require('http');
var Bluebird = require('bluebird');

function readJSON(pathname, qs) {
  return new Bluebird(function(resolve, reject) {
    var path = qs === undefined ? pathname :
      pathname + QS.stringify(qs);

    var httpOpts = {
      host: 'api.reddit.com',
      path: path
    };

    Http.request(httpOpts, function(response) {
      if (response.statusCode >= 300) {
        var err = new Error('Unexpected status code: ' + response.statusCode);
        err.statusCode = response.statusCode;
        err.headers = response.headers;
        return reject(err);
      }

      response.on('error', reject);

      var body = '';
      response.on('data', function(chunk) {
        body += chunk.toString('utf8');
      });
      response.on('end', function() {
        try {
          var parsed = JSON.parse(body);
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      });
    })
    .on('error', reject)
    .end();
  });
}

exports.about = function(subId) {
  // http://api.reddit.com/r/funny/about
  return readJSON('/r/' + subId + '/about');
};

exports.top = function(subId) {
  return readJSON('/r/' + subId + '/top');
};
