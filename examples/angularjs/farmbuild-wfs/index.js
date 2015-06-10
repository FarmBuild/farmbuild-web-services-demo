'use strict';


angular.module('farmbuild.webservices.examples.wfs', [])

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
      if(farmbuild.webservices.examples.wfsSampleEndPoints){
        $scope.wfsUrl=farmbuild.webservices.examples.wfsSampleEndPoints.soils;
      }
      $scope.wfsUrlList = [farmbuild.webservices.examples.wfsSampleEndPoints.soils ,farmbuild.webservices.examples.wfsSampleEndPoints.parcels];
      $scope.hasResponse = false;
      $scope.extentFilter="\<ogc:Filter><ogc:BBOX><ogc:PropertyName>Shape</ogc:PropertyName><gml:Box srsName=\"urn:x-ogc:def:crs:EPSG:4283\"><gml:coordinates>145.57368096419663,-36.22801228957186 145.58260951039628,-36.224879531701255</gml:coordinates></gml:Box></ogc:BBOX></ogc:Filter>";
		}
//    "\<ogc:Filter><ogc:BBOX><ogc:PropertyName>Shape</ogc:PropertyName><gml:Box srsName=\"urn:x-ogc:def:crs:EPSG:4283\"><gml:coordinates>145.57368096419663,-36.22801228957186 145.58260951039628,-36.224879531701255</gml:coordinates></gml:Box></ogc:BBOX></ogc:Filter>";

		$scope.connectWithToken = function(wfsUrl) {
			$scope.error = false;
			$scope.errorMessages = [];
			$scope.messages = [];
      $scope.rawMsg = null;
      $scope.hasResponse = false;
      var reqConfig = {
				method: 'GET'
			};
      reqConfig.params = {Filter:$scope.extentFilter};
			reqConfig.url = wfsUrl;

			var res = $http(reqConfig);
			res.success(function(data, status, headers, config) {
				$scope.messages.push("Successfully connect to WFS service.  Result:");
        $scope.hasResponse = true;
        $scope.rawMsg = JSON.stringify(data,null,"    ");
			});
			res.error(function(data, status, headers, config) {
				$scope.error = true;
				$scope.errorMessages.push("Error connecting to WFS "+status);
			});
		}


		$scope.reset();


		//For dev only

	});
