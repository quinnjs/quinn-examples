'use strict';

module.exports = function initMods(modModules) {
  var modKeys = Object.keys(modModules);

  function each(type, iterator) {
    var count = modKeys.length, i, key, mod;
    for (i = 0; i < count; ++i) {
      key = modKeys[i], mod = modModules[key];
      if (mod.hasOwnProperty(type)) {
        iterator(mod[type], key);
      }
    }
  }

  function routes(router) {
    each('routes', function(routeFn) {
      routeFn(router);
    });
  }

  return {
    each: each,
    routes: routes
  };
};
