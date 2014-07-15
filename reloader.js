#!/usr/bin/env node
'use strict';

var fs = require('fs');

var buggerV8Client = require('bugger-v8-client');
var DebugClient = buggerV8Client.DebugClient;
var createDebugClient = buggerV8Client.createDebugClient;

if (!process.env.NODE_ENV)
  process.env.NODE_ENV = 'development';

process.env.PATH = './node_modules/.bin:' + process.env.PATH;

var MODULE_HEADER = '(function (exports, require, module, __filename, __dirname) { ';
var MODULE_TRAILER = '\n});';

function withBugger(filename, args, debugBreak) {
  if (!Array.isArray(args)) { args = []; }

  var debugPrefix = debugBreak ? '--debug-brk=' : '--debug=';

  var execFile = require('child_process').execFile;

  var debugPort = 5858;

  var withNodeArgs = [
    '--harmony',
    debugPrefix + debugPort,
    filename
  ].concat(args);

  var child = execFile(process.argv[0], withNodeArgs, {
    cwd: process.cwd(), env: process.env
  });

  child.on('exit', function(exitCode) {
    console.log('Child died:', exitCode);
    process.exit(exitCode);
  });

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  process.on('exit', function() {
    try { child.kill(); } catch (e) {}
  });

  return createDebugClient(debugPort);
}

var bugger = withBugger(
  process.argv[2],
  process.argv.slice(3),
  process.env.BUGGER_BREAK
);

var scripts = {};
bugger.on('afterCompile', function(e) {
  var script = e.script;
  if (!script.url) return;

  if (/^file:\/\/[\w]+\.js$/.test(script.url)) {
    // disable - not interesting
  } else if (script.url.indexOf('file://') === 0) {
    var filename = script.url.substr(7);
    scripts[filename] = script;
  }
});

bugger.connect();

var watch = require('watch');
watch.watchTree(process.cwd(), {
  ignoreDotFiles: true,
  ignoreUnreadableDir: true,
  filter: function(filename) {
    return !(/\/node_modules$/.test(filename));
  }
}, function(filename, curr, prev) {
  if (typeof filename == "object" && prev === null && curr === null) {
    // Finished walking the tree
    console.log('Reloader ready.');
    return;
  } else if (prev === null) {
    // filename is a new file
  } else if (curr.nlink === 0) {
    // filename was removed
  } else {
    // filename was changed
    if (scripts[filename]) {
      var script = scripts[filename];
      fs.readFile(filename, 'utf8', function(err, data) {
        if (err) {
          console.log('Failed to reload %s (%s)', filename, err.message);
          return;
        }

        var wrappedSource = MODULE_HEADER + data + MODULE_TRAILER;

        bugger._sendRequest('changelive', {
          script_id: script.scriptId,
          preview_only: false,
          new_source: wrappedSource
        }, function(err, res) {
          if (err) {
            console.log(err, res);
          } else {
            console.log('Updated %s', filename, res);
          }
        });
      });
    }
  }
});
