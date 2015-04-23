'use strict';

angular.module('farmbuild.wfs.demo.auth', [])

	.run(function($rootScope){
		$rootScope.appVersion = "0.1";
		
	})

	.controller('WfsAuthCtrl', function ($scope, $http) {

		$scope.reset = function() {
			$scope.error = false;
			$scope.errorMessages = [];
			$scope.messages = [];
		}

		$scope.connect = function (authUrl, clientId, clientSecret, wfsUrl) {
			$scope.reset();

			//Authenticate to retrieve token
			var data = { grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret, scope: "WFS_SERVICES" };
			var res = $http.post(authUrl, dataObj);
			res.success(function(data, status, headers, config) {
				$scope.message = data;
			});
			res.error(function(data, status, headers, config) {
				alert( "failure message: " + JSON.stringify({data: data}));
			});
		}

		$scope.reset();

	});
