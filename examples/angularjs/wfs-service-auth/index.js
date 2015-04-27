'use strict';

/*app.config(['$httpProvider', function ($httpProvider) {
	//Reset headers to avoid OPTIONS request (aka preflight)
	$httpProvider.defaults.headers.common = {};
	$httpProvider.defaults.headers.post = {};
	$httpProvider.defaults.headers.put = {};
	$httpProvider.defaults.headers.patch = {};
}]);*/

angular.module('farmbuild.wfs.demo.auth', [])

	.run(function($rootScope){
		$rootScope.appVersion = "0.1";
		
	})

	.controller('WfsAuthCtrl', function ($scope, $http) {

		$scope.reset = function() {
			$scope.error = false;
			$scope.errorMessages = {
				'authentication':[],
				'wfs':[]
			};
			$scope.messages = {
				'authentication':[],
				'wfs':[]
			};
			$scope.token = null;
		}

		$scope.connectWFS = function(token, wfsUrl) {
			var res = $http({
				method: 'GET',
				url: wfsUrl,
				data : '',
				headers: {
					'Authorization': 'Bearer ' + token
				}
			})
			res.success(function(data, status, headers, config) {
				$scope.messages.wfs.push("Successfully connect to WFS service.  Result:");
				$scope.messages.wfs.push(data);
			});
			res.error(function(data, status, headers, config) {
				$scope.error = true;
				$scope.errorMessages.wfs.push("Error connecting to WFS "+status);
			});
		}

		$scope.authenticate = function (authUrl, clientId, clientSecret) {
			$scope.reset();

			//Authenticate to retrieve token
			var data = { grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret, scope: "WFS_SERVICES" };
			var res = $http({
				method: 'POST',
				url: authUrl,
				data: data,
				transformRequest: function(obj) {
					var str = [];
					for(var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				},
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			res.success(function(data, status, headers, config) {
				$scope.messages.authentication.push("Successfully authenticated.  Token is:");
				$scope.token = data.access_token
				$scope.messages.authentication.push($scope.token);
				//$scope.connectWFS($scope.token, $scope.wfsUrl);
			});
			res.error(function(data, status, headers, config) {
				$scope.error = true;
				$scope.errorMessages.authentication.push("Error authenticating, status returned "+status);
			});
		}

		$scope.reset();

		//For dev only
		$scope.authUrl = 'https://farmbuild-sts.dev.ag.ecodev.vic.gov.au/core/connect/token';
		$scope.clientId = 'TESTCLIENT';
		$scope.clientSecret = 'testClientSecret';
		$scope.wfsUrl = 'https://farmbuild-ws.dev.ag.ecodev.vic.gov.au/api/AllSoils';

	});
