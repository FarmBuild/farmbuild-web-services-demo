'use strict';

/**
 * AngularJS is popular JavaScript MVC framework which is developed by google.
 * In this example we use AngularJS to construct the structure of the client side application.
 * You can find out more about AngularJS at https://angularjs.org
 * In farmbuild project we have used AngularJS as an internal dependency to provide modular structure, but to use FarmBuild JavaScript libraries you are forced to use AngularJS.
 * All the api function are available via "farmbuild" namespace (eg: farmbuild.webmapping, farmbuild.nutrientcalculator).
 * If you are using AngularJS in your application you can consume farmbuild component as AngularJS modules, similar to this example.
 */
 
 /**
 * Defining my application. There are no dependency at this point so I am passing an empty array.
 */
angular.module('farmbuild.webservices.examples.wfs', [])
	/**
	 * In AngularJS Every application has a single root scope.
	 * All other scopes are descendant scopes of the root scope.
	 * Scopes provide separation between the model and the view, via a mechanism for watching the model for changes.
	 * They also provide an event emission/broadcast and subscription facility.
	 * See the AngularJS developer guide on scopes.
	 * https://docs.angularjs.org/guide/scope
	 */
	 
 	/**
	 * "run" method is executed before any other function in application, so I am putting my initial configs here.
	 */
    .run(function ($rootScope) {
        $rootScope.appVersion = farmbuild.webservices.examples.version;

    })

	/**
	 * "controller" is where I put the logic of my application
	 */
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
            /**
             * Read the wfs URL the config.js file located in examples directory
             */
            if (farmbuild.webservices.examples.wfsSampleEndPoints) {
                $scope.wfsUrl = farmbuild.webservices.examples.wfsSampleEndPoints.wfs.url;
            }
            /**
             * Prepare the drop down of service type by reading from the config.js file
             */
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

            /**
             * Prepare request header for the soil/parcels service
             */
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

            /**
             * Connect to the soils/parcels service using JSONP protocol
             * The $http service is a core Angular service that facilitates communication
             * with the remote HTTP servers via the browser's XMLHttpRequest object or via JSONP.
             * JSONP (or JSON with Padding) is a technique used by web developers to overcome the cross-domain 
             * restrictions imposed by browsers to allow data to be retrieved from systems other than the one the page was served by.
             * Read more about JSONP: https://en.wikipedia.org/wiki/JSONP
             */
            var res = $http.jsonp(reqConfig.url, {
                params: reqConfig.params
            });
            /**
             * Successfully receive response from server
             */
            res.success(function (data, status, headers, config) {
                $scope.messages.push("Successfully connect to WFS service.  Result:");
                $scope.hasResponse = true;
                $scope.rawMsg = JSON.stringify(data, null, "    ");
            });
            /**
             * Flag that an error is encountered
             */
            res.error(function (data, status, headers, config) {
                $scope.error = true;
            });
            /**
             * This block is executed regardless if the result is successful or failed.
             * It is required because this is the only way to examine the raw server response object since it's not
             * available in the error block
             *
             */
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



    });
