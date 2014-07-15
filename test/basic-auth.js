'use strict';

var _ = require('lodash');

var assert = require('assertive-as-promised');

var quickRequest = require('./quick-req');

describe('basic auth', function() {
  describe('/basic-auth, no auth', function() {
    before(function() {
      return this.parsedBody = quickRequest('/basic-auth', 401)
        .then(_.property('body'));
    });

    it('returns Unauthorized', function() {
      return assert.equal('Unauthorized', this.parsedBody);
    });
  });

  describe('/basic-auth, no auth', function() {
    before(function() {
      return this.parsedBody = quickRequest('/basic-auth', 200, {
        headers: {
          'Authorization': 'Basic ' + new Buffer('root:s3cr3t', 'ascii').toString('base64')
        }
      }).then(_.property('body'));
    });

    it('returns ok', function() {
      return assert.equal('ok', this.parsedBody);
    });
  });
});
