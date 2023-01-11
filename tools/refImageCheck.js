/*global require, console, process */

// NOTE: this check searches for 2 strings in urls: 'map' and 'tiles' to escape.

var exec = require('child_process').exec,
  plist = require('plist'),
  fs = require('fs'),
  error = 0,
  escape = require('../.escape.json').reference_images,
  files,
  excludeCheck = function (file) {
    'use strict';

    var path;

    for (path in escape) {
      if (file.includes(escape[path])) {
        return false;
      }
    }
    return true;
  };

if (!fs.existsSync('.tmp_staging/res/images')) {
  process.exit(0); // escape the check when there are no staged plists
}

exec('find .tmp_staging/res/images/ -name "*.plist"', function (err, stdout) {
  'use strict';

  if (err) {
    console.log('err:', err);
    return;
  }

  files = stdout.split('\n');

  files.forEach(function (file) {
    var frames = file !== '' && excludeCheck(file) &&
      plist.parse(fs.readFileSync(file, 'utf8')).frames,
      ref_path = file.substr(0, file.lastIndexOf('/') + 1)
        .replace('.tmp_staging/res/images/',
          '.tmp_staging/res/images/reference/'),
      frame;

    for (frame in frames) {
      if (!fs.existsSync(ref_path + frame)) {
        console.log('RefImg expected file', frame, 'in dir',
          ref_path.slice(ref_path.indexOf('/') + 1));
        error++;
      }
    }
  });

  process.exit(error);
});
