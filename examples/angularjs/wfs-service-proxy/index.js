'use strict';

angular.module('farmbuild.wfs.demo.auth', [])

	.run(function($rootScope){
		//$rootScope.appVersion = "0.1";
		$rootScope.appVersion = farmbuild.wfsSoilArea.demo.version;
	})

	.controller('WfsAuthCtrl', function ($scope, $http) {

		$scope.reset = function() {
			$scope.error = false;
			$scope.errorMessages = [];
			$scope.messages = [];
		}

		$scope.connectWFS = function( wfsUrl) {
			var res = $http({
				method: 'GET',
				url: wfsUrl
			})
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
		$scope.wfsUrl = 'http://localhost:9000/api/allSoils';

	});
