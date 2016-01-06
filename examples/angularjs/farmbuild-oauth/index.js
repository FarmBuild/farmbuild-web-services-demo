'use strict';

/**
 * AngularJS is popular JavaScript MVC framework which is developed by google.
 * In this example we use AngularJS to construct the structure of the client side application.
 * You can find out more about AngularJS at https://angularjs.org
 * In farmbuild project we have used AngularJS as an internal dependency to provide modular structure, but to use FarmBuild JavaScript libraries you are not forced to use AngularJS.
 * All the api function are available via "farmbuild" namespace (eg: farmbuild.webmapping, farmbuild.nutrientcalculator).
 * Have a look at the jQuery example section to understand more on how to use farmbuild api without directly. (https://github.com/FarmBuild/farmbuild-dairy-nutrient-calculator/tree/master/examples/jquery)
 * If you are using AngularJS in your application you can consume farmbuild component as AngularJS modules, similar to this example.
 */
 
 /**
 * Defining my application. There are no dependency at this point so we are passing an empty array.
 */
angular.module('farmbuild.wfs.demo.auth', [])
/**
	 * In AngularJS Every application has a single root scope.
	 * All other scopes are descendant scopes of the root scope.
	 * Scopes provide separation between the model and the view, via a mechanism for watching the model for changes.
	 * They also provide an event emission/broadcast and subscription facility.
	 * See the AngularJS developer guide on scopes.
	 * https://docs.angularjs.org/guide/scope
	 */
	 
 	/**
	 * "run" method is executed before any other function in application, so we are putting my initial configs here.
	 */
    .run(function ($rootScope) {
        /**
         * Read the application version from the config.js file located in examples directory
         */
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

            /**
             *  Prepare JSON data to submit to the authentication server
             */
            var data = {
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSecret,
                scope: authScope
            };

            /**
             * Submits data to the authentication server.
             * Note that by default angular post the data in JSON format, however the authentication
             * server expects data in HTML form format (i.e: "key1=value1&key2=value2..."
             * This is why the transform method is required.
             * The $http service is a core Angular service that facilitates communication
             * with the remote HTTP servers via the browser's XMLHttpRequest object or via JSONP.
             */
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
            /**
             * Successfully receive response from server
             */
            res.success(function (data, status, headers, config) {
                $scope.messages.push("Successfully authenticated.  Token is:");
                $scope.token = data.access_token

            });
            /**
             * Handles server error response
             */
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
