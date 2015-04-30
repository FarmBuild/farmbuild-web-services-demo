'use strict';

if (!window.farmbuild.webservices) {
	window.farmbuild.webservices = {};
}

window.farmbuild.webservices.examples = {
	version: '0.2',
	authentication: {
		scopes: ['WFS_SERVICES', 'SOIL_AREA_SERVICES', 'CLIMATE_DATA_SERVICES']
	}
};
