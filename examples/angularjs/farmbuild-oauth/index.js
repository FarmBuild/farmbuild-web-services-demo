'use strict';

/**
 * This example page is developed using the JavaScript MVC framework called AngularJS.
 * You can find out more about AngularJS at https://angularjs.org
 */
angular.module('farmbuild.wfs.demo.auth', [])

    .run(function ($rootScope) {
        $rootScope.appVersion = farmbuild.webservices.examples.version;

    })

    .controller('WfsAuthCtrl', function ($scope, $http) {

        /**
         * Sets all variables and outputs to their initial state.
         */
        $scope.reset = function () {
            $scope.error = false;
            $scope.errorMessages = [];
            $scope.messages = [];
            $scope.token = null;
        }


        /**
         * Connects to the FarmBuild identity service to obtain an authentication token
         * @param authUrl       Identity service end point URL
         * @param clientId      Client id
         * @param clientSecret  Client secret
         * @param authScope     Service scope
         */
        $scope.authenticate = function (authUrl, clientId, clientSecret, authScope) {
            $scope.reset();

            //Authenticate to retrieve token
            var data = {
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSecret,
                scope: authScope
            };
            var res = $http({
                method: 'POST',
                url: authUrl,
                data: data,
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            res.success(function (data, status, headers, config) {
                $scope.messages.push("Successfully authenticated.  Token is:");
                $scope.token = data.access_token

            });
            res.error(function (data, status, headers, config) {
                $scope.error = true;
                var errorToDisplay = "Error authenticating, status returned " + status;
                switch (status) {
                    case 400:
                    {
                        errorToDisplay = 'One or more of the field values are invalid.';
                        break;
                    }
                    case 401:
                    {
                        errorToDisplay = 'Access has been denied please contact the FarmBuild administrator.';
                        break;
                    }
                }
                $scope.errorMessages.push(errorToDisplay);
            });
        }

        $scope.reset();

        $scope.authScopes = farmbuild.webservices.examples.authentication.scopes;

        $scope.authUrl = 'https://oauth-fb.agriculture.vic.gov.au/core/connect/token';
        $scope.clientId, $scope.clientSecret;
        $scope.authScope = 'SOIL_AREA_SERVICES';

    });
