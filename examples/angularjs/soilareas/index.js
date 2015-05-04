'use strict';


angular.module('farmbuild.webservices.examples.soilarea', [])

	.run(function($rootScope){
		$rootScope.appVersion = farmbuild.webservices.examples.version;
		
	})

	.controller('WfsAuthCtrl', function ($scope, $http) {

		$scope.reset = function() {
			$scope.error = false;
			$scope.errorMessages = [];
			$scope.messages = [];
			$scope.token = null;
			$scope.proxyUrl = null;
			$scope.mode = null;
		}

		$scope.connectWithToken = function(wfsUrl, token, farmdata) {
			$scope.error = false;
			$scope.errorMessages = [];
			$scope.messages = [];
			var reqConfig = {
				method: 'POST',
				data : farmdata
			};

			reqConfig.url = wfsUrl;
			reqConfig.headers= {
				'Authorization': 'Bearer ' + token
			};

			var res = $http(reqConfig);
			res.success(function(data, status, headers, config) {
				$scope.messages.push("Successfully connect to WFS service.  Result:");
				$scope.messages.push(data);
			});
			res.error(function(data, status, headers, config) {
				$scope.error = true;
				$scope.errorMessages.push("Error connecting to WFS "+status);
			});
		}

		$scope.connectViaProxy = function(proxyUrl, farmdata) {
			$scope.error = false;
			$scope.errorMessages = [];
			$scope.messages = [];
			var reqConfig = {
				method: 'POST',
				data : farmdata,
				url : proxyUrl
			};
			var res = $http(reqConfig);
			res.success(function(data, status, headers, config) {
				$scope.messages.push("Successfully connect to WFS service.  Result:");
				$scope.messages.push(data);
			});
			res.error(function(data, status, headers, config) {
				$scope.error = true;
				$scope.errorMessages.push("Error connecting to WFS "+status);
			});
		}

		$scope.reset();


		//For dev only

	});
