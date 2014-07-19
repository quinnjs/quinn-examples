'use strict';

var React = require('react');
var _ = require('lodash');
var resolveDeep = require('resolve-deep');
var respond = require('quinn-respond');

function render(component, options) {
  options = options || {};
  return respond({
    headers: {
      'Content-Type': 'text/html; charset=utf8'
    },
    body: resolveDeep(component.props).then(function(resolvedProps) {
      _.each(resolvedProps, function(propValue, propKey) {
        component.props[propKey] = propValue;
      });

      if (options.staticMarkup) {
        return React.renderComponentToStaticMarkup(component);
      } else {
        return React.renderComponentToString(component);
      }
    }),
  });
}

module.exports = render;
