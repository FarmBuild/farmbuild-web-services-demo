
module.exports = (function() {
  'use strict';
  var config = {};

  config.testWFS = 'https://farmbuild-ws.dev.ag.ecodev.vic.gov.au/api/AllSoils';
  config.authWFS = 'https://farmbuild-sts.dev.ag.ecodev.vic.gov.au/core/connect/token';
  config.clientId = 'TESTCLIENT';
  config.clientSecret = 'testClientSecret';

  console.log('config: %j', config);

  return config;
});