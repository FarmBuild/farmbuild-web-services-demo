'use strict';


angular.module('farmbuild.webservices.examples.soilarea', ['farmbuild.farmdata'])

	.run(function($rootScope){
		$rootScope.appVersion = farmbuild.webservices.examples.version;
		
	})

	.controller('WfsAuthCtrl', function ($scope, $http, $log , farmdata) {

		$scope.reset = function() {
			$scope.error = false;
			$scope.errorMessages = [];
			$scope.messages = [];
			$scope.token = null;
			$scope.proxyUrl = null;
			$scope.mode = null;
      loadDefaultFarmData();
      $scope.hasSoilInfo = false;
      $scope.rawMsg=null;
		}

		$scope.connectWithToken = function(wfsUrl, token, farmdatainput) {
			$scope.error = false;
			$scope.errorMessages = [];
			$scope.messages = [];
			var reqConfig = {
				method: 'POST',
				data : farmdatainput
			};

			reqConfig.url = wfsUrl;
			reqConfig.headers= {
				'Authorization': 'Bearer ' + token
			};

			var res = $http(reqConfig);
			res.success(function(data, status, headers, config) {
        $scope.messages.push("Successfully connect to WFS service.  Result:");
        $scope.rawMsg = JSON.stringify(data,null,"    ");
        $scope.hasSoilInfo = true;
			});
			res.error(function(data, status, headers, config) {
				$scope.error = true;
				$scope.errorMessages.push("Error connecting to WFS "+status);
			});
		}

		$scope.connectViaProxy = function(proxyUrl, farmdatainput) {
			$scope.error = false;
			$scope.errorMessages = [];
			$scope.messages = [];


			var reqConfig = {
				method: 'POST',
				data : farmdatainput,
				url : proxyUrl
			};
			var res = $http(reqConfig);
			res.success(function(data, status, headers, config) {
				$scope.messages.push("Successfully connect to WFS service.  Result:");
        $scope.rawMsg = JSON.stringify(data,null,"    ");
        $scope.hasSoilInfo = true;
			});
			res.error(function(data, status, headers, config) {
				$scope.error = true;
				$scope.errorMessages.push("Error connecting to WFS "+status);
			});
		}



    function loadDefaultFarmData(){
      $http.get('../../lib/farmdata-susan.json').success(function(data) {
        var stringifiedFarmData = JSON.stringify(data,null,"    ");
        $scope.farmdata4token= stringifiedFarmData;
        $scope.farmdata4proxy= stringifiedFarmData;
        if(farmbuild.webservices.examples.wfsSampleEndPoints){
          $scope.wfsUrl=farmbuild.webservices.examples.wfsSampleEndPoints.soilareas;
        }

      });

    };

    $scope.reset();
		//For dev only


	});
