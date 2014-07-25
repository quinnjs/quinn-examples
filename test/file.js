'use strict';

var _ = require('lodash');

var assert = require('assertive-as-promised');

var quickRequest = require('./quick-req');

describe('file', function() {
  describe('existing file', function() {
    before(function() {
      return this.parsedBody = quickRequest('/file/thing')
        .then(_.property('body'));
    });

    it('starts with the HTML5 doctype', function() {
      return assert.match(/^<!DOCTYPE html>/, this.parsedBody);
    });

    it('has funky html stuff', function() {
      return assert.include('<html', this.parsedBody);
    });

    it('has a file heading', function() {
      return assert.include('<h1>A file.</h1>', this.parsedBody);
    });
  });

  describe('missing file', function() {
    before(function() {
      var result = quickRequest('/file/missing');

      this.parsedBody = result.then(_.property('body'));
      this.statusCode = result.then(_.property('statusCode'));

      return this.response = result;
    });

    it('leads to a 500', function() {
      return assert.equal(500, this.statusCode);
    });

    it('writes a non-helpful error message', function() {
      return assert.equal('Internal server error', this.parsedBody);
    });
  });
});
