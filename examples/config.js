'use strict';

if (!window.farmbuild.webservices) {
	window.farmbuild.webservices = {};
}

window.farmbuild.webservices.examples = {
		version: '0.2',
		authentication : {
			auth : 'https://farmbuild-sts.dev.ag.ecodev.vic.gov.au/core/connect/token',
			clientId : 'TESTCLIENT',
			clientSecret : 'testClientSecret'
		}
};
