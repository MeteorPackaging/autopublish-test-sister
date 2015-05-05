var
  fs = require('fs'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  git = require('gulp-git'),
  del = require('del'),
  replace = require('gulp-replace'),
  runSequence = require('run-sequence'),
	autopublish = require('./autopublish.json')
;


// Clone the upstream repo
// optional parameter: --tag <tag_name>
gulp.task('clone', function(){
  return del(['upstream'], function(err){
    if (err) throw err;
    git.clone(autopublish.upstream.git, {args: 'upstream'}, function (err) {
      if (err) throw err;
    });
  });
});

// Clone the upstream repo
// optional parameter: --tag <tag_name>
gulp.task('checkout', function(){
  var
    version = autopublish.version,
    tag = gutil.env.tag || version,
    path = __dirname + '/upstream/'
  ;
  console.log('checking out ' + tag);
  return git.checkout(tag, {cwd: path}, function (err) {
    if (err) throw err;
    git.status({cwd: path}, function (err) {
      if (err) throw err;
    });
  });
});


gulp.task('getUpstream', function(callback) {
  runSequence('clone', 'checkout', function (err) {
    if (err) throw err;
  });
});


// Picks up current version of upstream repo and updates
// 'package.js' and 'autopublish.json' accordingly
gulp.task('updateVersion', function() {
  var
    versionFile = autopublish.upstream.versionFile,
    path = './upstream/' + versionFile
  ;

  return fs.readFile(path, 'utf8', function (err, content) {
    if (err) throw err;

    var
      versionRegexp = /(version?\"?\s?=?\:?\s[\'\"])([\d\.]*)([\'\"])/gi,
      match = versionRegexp.exec(content)
    ;
    if (match.length === 4) {
      var version = match[2];
      console.log('Verision: ' + version);
      gulp.src(['package.js', 'autopublish.json'])
        .pipe(replace(versionRegexp, '$1' + version + '$3'))
        .pipe(gulp.dest('./'));
    }
    else {
      throw 'Unable to extract current version!';
    }
  });
});



gulp.task('commit', function(){
  var
    path = __dirname,
    version = autopublish.version
  ;

  return gulp.src('./*', {cwd: path})
    .pipe(git.commit(undefined, {
      args: '-am "Bump to version ' + version + '!"',
      disableMessageRequirement: true
    }));
});

// Run git push
gulp.task('push', function(){
  var
    path = __dirname
  ;
  return git.push('origin', 'master', {cwd: path}, function (err) {
    if (err) throw err;
  });
});


// default task
// run 'gulp' from command line
gulp.task('default', function(callback) {
  console.log('Running all tasks...');
  // runSequence('getUpstream', 'updateVersion', 'commit', 'push', function (err) {
  runSequence('updateVersion', 'commit', 'push', function (err) {
    if (err) throw err;
  });
});
