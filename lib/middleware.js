'use strict';

var runRequestHandler = require('quinn').runRequestHandler;
module.exports = function middleware(outer) {
  return function (inner) {
    return function(req, params) {
      return outer(req, params, function(patchedReq, patchedParams) {
        return runRequestHandler(
          inner,
          patchedReq || req,
          patchedParams || params);
      });
    }
  }
};
