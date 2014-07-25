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

  var res = respond.html();

  resolveDeep(component.props)
  .then(function(resolvedProps) {
    _.extend(component.props, resolvedProps);

    var html = options.staticMarkup ?
        React.renderComponentToStaticMarkup(component)
      : React.renderComponentToString(component);

    res.write(prefix);
    res.write(html);
    res.write(postfix);
    res.end();
  })
  .catch(function(err) {
    res.error(err);
  });

  return res;
}

module.exports = render;
