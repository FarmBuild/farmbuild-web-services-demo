
module.exports = (function() {
  'use strict';

  //skip self signed cer check
  //https://github.com/visionmedia/superagent/issues/188
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  var confige2e = {};

  confige2e.authentication = {
      scopes : {
        WFS : 'WFS_SERVICES',
        SOIL_AREA :'SOIL_AREA_SERVICES'
      },
      url : 'https://farmbuild-sts.dev.ag.ecodev.vic.gov.au/core/connect/token',
      scope : 'WFS_SERVICES',
      clientId : 'TESTCLIENT',
      clientSecret : 'testClientSecret'
      };

  confige2e.wfs = {
      soils : 'https://farmbuild-ws.dev.ag.ecodev.vic.gov.au/soils',
      parcels: 'https://farmbuild-ws.dev.ag.ecodev.vic.gov.au/parcels',
      soilareas: 'https://farmbuild-soil.dev.ag.ecodev.vic.gov.au/areas'
      };

  console.log('config created: %j', confige2e);

  return confige2e;
});