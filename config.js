
module.exports = (function() {
  'use strict';

  //skip self signed cer check
  //https://github.com/visionmedia/superagent/issues/188
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  var config = {};

  config.wfsSoilArea = 'https://farmbuild-ws.dev.ag.ecodev.vic.gov.au/api/AllSoils';
  config.auth = 'https://farmbuild-sts.dev.ag.ecodev.vic.gov.au/core/connect/token';
  config.clientId = 'TESTCLIENT';
  config.clientSecret = 'testClientSecret';

  console.log('config created: %j', config);

  return config;
});