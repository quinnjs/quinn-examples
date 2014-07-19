'use strict';

var _ = require('lodash');

var assert = require('assertive-as-promised');

var quickRequest = require('./quick-req');

describe('reddit', function() {
  describe('/r/javascript', function() {
    before(function() {
      return this.parsedBody = quickRequest('/r/javascript')
        .then(_.property('body'));
    });

    it('starts with the HTML5 doctype', function() {
      return assert.match(/^<!DOCTYPE html>/, this.parsedBody);
    });

    it('has funky html stuff', function() {
      return assert.include('<html', this.parsedBody);
    });

    it('has a script heading', function() {
      return assert.include('<h5>JavaScript</h5>', this.parsedBody);
    });
  });
});
