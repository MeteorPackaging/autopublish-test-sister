Package.describe({
  name: 'packaging:autopublish-test',
  summary: 'Dummy package to test auto-publish with TravisCI. DO NOT USE!',
  version: '0.1.17',
  git: 'https://github.com/MeteorPackaging/autopublish-test.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.1');
  api.addFiles('upstream/lib/main.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('packaging:autopublish-test');
  api.addFiles('upstream/tests/main.js');
});
