'use strict';

if (!window.farmbuild.webservices) {
	window.farmbuild.webservices = {};
}

window.farmbuild.webservices.examples = {
	version: '0.2',
	authentication: {
		scopes: ['WFS_SERVICES', 'SOIL_AREA_SERVICES', 'CLIMATE_DATA_SERVICES']
	},
  wfsSampleEndPoints : {
    soils : 'https://farmbuild-ws.dev.ag.ecodev.vic.gov.au/soils',
    parcels: 'https://farmbuild-ws.dev.ag.ecodev.vic.gov.au/parcels',
    soilareas: 'https://farmbuild-soil.dev.ag.ecodev.vic.gov.au/areas'
  }

};
