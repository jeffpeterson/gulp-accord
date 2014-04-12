(function() {
  var accord, gutil, map, path;

  gutil = require('gulp-util');
  accord = require('accord');
  map = require('map-stream');
  path = require('path');

  module.exports = function(lang, opts) {
    var PLUGIN_NAME, adapter, err;
    PLUGIN_NAME = 'gulp-accord';

    if (!accord.supports(lang)) {
      throw new Error("" + PLUGIN_NAME + ": Language '" + lang + "' not supported");
    }

    try {
      adapter = accord.load(lang);
    } catch (_error) {
      err = _error;
      throw new Error("" + PLUGIN_NAME + ": " + lang + " not installed. Try 'npm i " + lang + " -S'");
    }

    return map(function(file, cb) {
      if (file.isNull()) {
        return cb();
      }

      if (file.isStream()) {
        return cb(new gutil.PluginError(PLUGIN_NAME, "streams not supported!"));
      }

      if (file.isBuffer()) {
        return adapter.render(String(file.contents), opts).then(function(res) {
          return file.contents = new Buffer(res);
        }).done((function() {
          return cb(null, file);
        }), function(err) {
          return cb(new gutil.PluginError(PLUGIN_NAME, err));
        });
      }
    });
  };

}).call(this);
