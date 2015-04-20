var
  gulp = require('gulp');
  replace = require('gulp-replace'),
	package = require('./upstream/package.json')
;

// The default task (called when you run `gulp` from cli)
gulp.task('default', function() {
  gulp.src('package.js')
    .pipe(replace(/(version?\s?=?\:?\s\')([\d\.]*)\'/gi, '$1' + package.version + "'"))
    .pipe(gulp.dest('./'));
});
