'use strict';

/**
 * This example page is developed using the JavaScript MVC framework called AngularJS.
 * You can find out more about AngularJS at https://angularjs.org
 */
angular.module('farmbuild.webservices.examples.soil', ['farmbuild.farmdata', 'farmbuild.webservices.examples.soil'])

    .run(function ($rootScope) {
        /**
         * Read the application version from the config.js file located in examples directory
         */
        $rootScope.appVersion = farmbuild.webservices.examples.version;

    })

    .controller('SoilArea', function ($scope, $http, $log, farmdata, soilarea) {

        /**
         * Sets all variables and outputs to their initial state.
         */
        $scope.reset = function () {
            $scope.error = false;
            $scope.errorMessages = [];
            $scope.messages = [];
            $scope.token = null;
            $scope.mode = null;

            $scope.proxyUrl = 'http://localhost:9000';
            loadDefaultFarmData();
        }

        /**
         * Executes Ajax POST with the given request configuration.
         *
         * @param reqConfig     Ajax request configuration
         */
        function execute(reqConfig) {
            var res = $http(reqConfig);
            /**
             * Successfully receive response from server
             */
            res.success(function (data, status, headers, config) {

                $scope.messages.push("Successfully connect to Soil Area service.  Result:");

                $scope.hasSoilInfo = true;
                /**
                 * Formats the farm soil area for display using the soil area parser utility
                 */
                var farmSoilInfo = soilarea.farmSoilArea(data);
                $scope.farmSoilInfo = farmSoilInfo;

                /**
                 * Formats the paddock soil area for display using the soil area parser utility
                 */
                $scope.paddockSoilInfo = soilarea.paddockSoilArea(data);
                $scope.rawMsg = JSON.stringify(data, null, "    ");
            });
            /**
             * Handles server error response
             */
            res.error(function (data, status, headers, config) {
                $scope.error = true;
                var errorToDisplay = "Error authenticating, status returned " + status;
                switch (status) {
                    case 401:
                    {
                        errorToDisplay = 'Access has been denied please contact the FarmBuild administrator.';
                        break;
                    }
                    case 404:
                    {
                        errorToDisplay = 'Cannot connect to the Soils service.  If you are connecting using proxy, please ensure the proxy is running.';
                        break;
                    }
                }
                $scope.errorMessages.push(errorToDisplay);
                $scope.hasSoilInfo = false;
            });
        }

        /**
         * Connects to the Soil Area service with the given authentication token and FarmData input
         *
         * @param wfsUrl            Soil Area Service end point URL
         * @param token             Authentication token
         * @param farmdatainput     FarmData JSON containing geometry information
         */
        $scope.connectWithToken = function (wfsUrl, token, farmdatainput) {
            $scope.error = false;
            $scope.errorMessages = [];
            $scope.messages = [];

            /**
             * Prepare request header to be sent to Soil Area Service
             */
            var reqConfig = {
                method: 'POST',
                data: farmdatainput
            };

            reqConfig.url = wfsUrl;
            /**
             * This is where the OAuth2 token is set in the header
             */
            reqConfig.headers = {
                'Authorization': 'Bearer ' + token
            };

            execute(reqConfig);
        }


        /**
         * Load the example susan's FarmData JSON file from the server
         */
        function loadDefaultFarmData() {
            $http.get('farmdata-susan.json').success(function (data) {
                var stringifiedFarmData = JSON.stringify(data, null, "    ");
                $scope.farmdata4token = stringifiedFarmData;
            });
            if (farmbuild.webservices.examples.wfsSampleEndPoints) {
                $scope.wfsUrl = farmbuild.webservices.examples.wfsSampleEndPoints.soilareas;
            }
        };

        $scope.reset();



    }
);

