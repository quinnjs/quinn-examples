'use strict';

module.exports = function withMarker(MARKER) {
  function patch(obj, methods, patched) {
    methods.forEach(function(method) {
      var original = obj[method];
      if ('function' !== typeof original) {
        throw new Error('Could not patch method: ' + method);
      }

      if (original.__HTTSPY === MARKER) return;

      obj[method] = patched(original);
      if ('function' !== typeof obj[method]) {
        throw new Error('Invalid patch for method: ' + method);
      }
      obj[method].__HTTSPY = MARKER;
    });
  }

  return patch;
}
