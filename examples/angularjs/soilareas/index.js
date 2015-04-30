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

		$scope.connectSoilArea = function(wfsUrl, token, proxyUrl, farmdata) {
/*			var res = $http({
				method: 'GET',
				data : ''
			})*/
			var reqConfig = {
				method: 'POST',
				data : farmdata
			};
			if ('PROXY' === $scope.mode) {
				reqConfig.url = proxyUrl;
			}
			else  {
				reqConfig.url = wfsUrl;
				reqConfig.headers= {
					'Authorization': 'Bearer ' + token
				};
			}
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

		$scope.connectWithToken = function() {
			$scope.mode = 'TOKEN';
		};

		$scope.connectViaProxy = function() {
			$scope.mode = 'PROXY';
		}

		$scope.reset();


		//For dev only

	});
