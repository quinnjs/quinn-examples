
exports.routes = function(router) {
  router.GET('/_gc', function(req) {
    if (typeof global.gc === 'function') {
      global.gc();
      return 'ok';
    } else {
      return 'Enable gc with --expose-gc';
    }
  });
}
