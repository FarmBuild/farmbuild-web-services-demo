'use strict';

/**
 * This example page is developed using the JavaScript MVC framework called AngularJS.
 * You can find out more about AngularJS at https://angularjs.org
 */
angular.module('farmbuild.webservices.examples.wfs', [])

    .run(function ($rootScope) {
        $rootScope.appVersion = farmbuild.webservices.examples.version;

    })

    .controller('WfsAuthCtrl', function ($scope, $http) {

        var extent = [16204823.698695935, -4332241.187057228, 16206541.143175218, -4331412.32303176];
        var bbox = extent.join(',') + ',EPSG:3857';

        /**
         * Sets all variables and outputs to their initial state.
         */
        $scope.reset = function () {
            $scope.error = false;
            $scope.errorMessages = [];
            $scope.messages = [];
            if (farmbuild.webservices.examples.wfsSampleEndPoints) {
                $scope.wfsUrl = farmbuild.webservices.examples.wfsSampleEndPoints.wfs.url;
            }
            $scope.wfsTypeList = [
                {'label': 'Soils', 'url': farmbuild.webservices.examples.wfsSampleEndPoints.wfs.soilTypeName},
                {'label': 'Rural Parcels', 'url': farmbuild.webservices.examples.wfsSampleEndPoints.wfs.parcelsTypeName}
            ];
            $scope.wfsType = $scope.wfsTypeList[0];
            $scope.hasResponse = false;
            $scope.extentFilter = "bbox=" + bbox;
            $scope.wfsType = $scope.wfsTypeList[0];

        }

        /**
         * Connect to the specified WFS URL and service type using JSONP protocol.
         * @param wfsUrl    WFS end point
         * @param wfsType   WFS service type of interest (soils or rural parcels)
         */
        $scope.connect = function (wfsUrl, wfsType) {
            $scope.error = false;
            $scope.errorMessages = [];
            $scope.messages = [];
            $scope.rawMsg = null;
            $scope.hasResponse = false;
            var reqConfig = {
                method: 'GET'
            };

            reqConfig.url = wfsUrl;
            reqConfig.params = {
                service: 'WFS',
                typeName: wfsType.url,
                version: '1.0.0',
                request: 'GetFeature',
                outputFormat: 'text/javascript',
                format_options: 'callback:JSON_CALLBACK',
                srsname: 'EPSG:3857',
                bbox: bbox
            }

            var res = $http.jsonp(reqConfig.url, {
                params: reqConfig.params
            });
            res.success(function (data, status, headers, config) {
                $scope.messages.push("Successfully connect to WFS service.  Result:");
                $scope.hasResponse = true;
                $scope.rawMsg = JSON.stringify(data, null, "    ");
            });
            res.error(function (data, status, headers, config) {
                $scope.error = true;

            });
            res.then(function (response) {
                if ($scope.error) {
                    if (response.status + '' == '401') {
                        $scope.errorMessages.push('Access has been denied please contact the FarmBuild administrator.');
                    }
                    else {
                        $scope.errorMessages.push("Error connecting to WFS, status: " + response.status
                        + ', message: ' + response.data);
                    }
                }

            });
        }


        $scope.reset();


        //For dev only

    });
