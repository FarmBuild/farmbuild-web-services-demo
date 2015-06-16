'use strict';


angular.module('farmbuild.webservices.examples.wfs', [])

    .run(function ($rootScope) {
        $rootScope.appVersion = farmbuild.webservices.examples.version;

    })

    .controller('WfsAuthCtrl', function ($scope, $http) {

        var extent = [16204823.698695935, -4332241.187057228, 16206541.143175218, -4331412.32303176];
        var bbox = extent.join(',') + ',EPSG:3857';

        $scope.reset = function () {
            $scope.error = false;
            $scope.errorMessages = [];
            $scope.messages = [];
            $scope.token = null;
            $scope.proxyUrl = null;
            $scope.mode = null;
            if (farmbuild.webservices.examples.wfsSampleEndPoints) {
                $scope.wfsUrl = farmbuild.webservices.examples.wfsSampleEndPoints.soils;
            }
            $scope.wfsUrlList = [farmbuild.webservices.examples.wfsSampleEndPoints.soils, farmbuild.webservices.examples.wfsSampleEndPoints.parcels];
            $scope.hasResponse = false;
            $scope.extentFilter="bbox="+bbox;

        }
//    "\<ogc:Filter><ogc:BBOX><ogc:PropertyName>Shape</ogc:PropertyName><gml:Box srsName=\"urn:x-ogc:def:crs:EPSG:4283\"><gml:coordinates>145.57368096419663,-36.22801228957186 145.58260951039628,-36.224879531701255</gml:coordinates></gml:Box></ogc:BBOX></ogc:Filter>";

<<<<<<< HEAD
        $scope.connectWithToken = function (wfsUrl) {
            $scope.error = false;
            $scope.errorMessages = [];
            $scope.messages = [];
            $scope.rawMsg = null;
            $scope.hasResponse = false;
            var reqConfig = {
                method: 'GET'
            };


            //reqConfig.params = {Filter: $scope.extentFilter};
            reqConfig.url = wfsUrl;s
            reqConfig.params = {
                service: 'WFS',
                version: '1.0.0',
                request: 'GetFeature',
                outputFormat: 'text/javascript',
                format_options: 'callback:JSON_CALLBACK',
                srsname: 'EPSG:3857',
                bbox: bbox
            }

            var res = $http.jsonp(reqConfig.url, {
                params : reqConfig.params
            });
            res.success(function (data, status, headers, config) {
                $scope.messages.push("Successfully connect to WFS service.  Result:");
                $scope.hasResponse = true;
                $scope.rawMsg = JSON.stringify(data, null, "    ");
            });
            res.error(function (data, status, headers, config) {
                $scope.error = true;

            });
            res.then(function(response) {
                if($scope.error) {
                    $scope.errorMessages.push("Error connecting to WFS, status: " + response.statusText
                    + ', message: '+response.data);
                }

            });
        }


        $scope.reset();


        //For dev only

    });
=======
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
        var errorToDisplay = "Error authenticating, status returned "+status ;
        switch(status){
          case 401:{
            errorToDisplay ='Access has been denied please contact the FarmBuild administrator.';
            break;
          }
        }
        $scope.errorMessages.push(errorToDisplay);
			});
		}


		$scope.reset();


		//For dev only

	});
>>>>>>> 91021198b33ea0d5be0a57bb2175f78fe2763a8a
