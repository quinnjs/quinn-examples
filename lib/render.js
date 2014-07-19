'use strict';

var React = require('react');
var _ = require('lodash');
var resolveDeep = require('resolve-deep');
var respond = require('quinn-respond');

var HTML5 = '<!DOCTYPE html>';

function render(component, options) {
  options = options || {};
  var prefix = options.prefix === undefined ? HTML5 : options.prefix;
  var postfix = options.postfix || '';
  return respond({
    headers: {
      'Content-Type': 'text/html; charset=utf8'
    },
    body: resolveDeep(component.props).then(function(resolvedProps) {
      _.each(resolvedProps, function(propValue, propKey) {
        component.props[propKey] = propValue;
      });

      var html = options.staticMarkup ?
          React.renderComponentToStaticMarkup(component)
        : React.renderComponentToString(component);

      return prefix + html + postfix;
    }),
  });
}

module.exports = render;
