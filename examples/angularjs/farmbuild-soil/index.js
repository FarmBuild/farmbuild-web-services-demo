'use strict';

/**
 * This example page is developed using the JavaScript MVC framework called AngularJS.
 * You can find out more about AngularJS at https://angularjs.org
 */
angular.module('farmbuild.webservices.examples.soil', ['farmbuild.farmdata', 'farmbuild.webservices.examples.soil'])

    .run(function ($rootScope) {
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
         * @param reqConfig
         */
        function execute(reqConfig) {
            var res = $http(reqConfig);
            res.success(function (data, status, headers, config) {

                $scope.messages.push("Successfully connect to Soil Area service.  Result:");

                $scope.hasSoilInfo = true;
                var farmSoilInfo = soilarea.farmSoilArea(data);
                $scope.farmSoilInfo = farmSoilInfo;
                $scope.paddockSoilInfo = soilarea.paddockSoilArea(data);
                $scope.rawMsg = JSON.stringify(data, null, "    ");
            });

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
         * Connects to the Soil Area service with the given authentication token and farm data input
         *
         * @param wfsUrl
         * @param token
         * @param farmdatainput
         */
        $scope.connectWithToken = function (wfsUrl, token, farmdatainput) {
            $scope.error = false;
            $scope.errorMessages = [];
            $scope.messages = [];

            var reqConfig = {
                method: 'POST',
                data: farmdatainput
            };

            reqConfig.url = wfsUrl;
            reqConfig.headers = {
                'Authorization': 'Bearer ' + token
            };

            execute(reqConfig);
        }


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
        //For dev only


    }
);

