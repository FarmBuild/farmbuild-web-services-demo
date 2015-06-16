'use strict';

if (!window.farmbuild.webservices) {
	window.farmbuild.webservices = {};
}

window.farmbuild.webservices.examples = {
	version: '0.2',
	authentication: {
		scopes: ['SOIL_AREA_SERVICES']
	},
  wfsDevSampleEndPoints : {
    soils : 'https://farmbuild-ws.dev.ag.ecodev.vic.gov.au/soils',
    parcels: 'https://farmbuild-ws.dev.ag.ecodev.vic.gov.au/parcels',
    soilareas: 'https://farmbuild-soil.dev.ag.ecodev.vic.gov.au/areas'
  },
  wfsSampleEndPoints : {
    wfs : {
        "url" : 'https://farmbuild-wfs-stg.agriculture.vic.gov.au/geoserver/farmbuild/wfs',
        "soilTypeName" : 'farmbuild:soils',
        "parcelsTypeName" : 'farmbuild:parcels'
    },
    soilareas: 'https://farmbuild-soil-stg.agriculture.vic.gov.au/areas'
  }

};
