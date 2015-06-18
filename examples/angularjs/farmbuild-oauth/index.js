'use strict';

/*app.config(['$httpProvider', function ($httpProvider) {
	//Reset headers to avoid OPTIONS request (aka preflight)
	$httpProvider.defaults.headers.common = {};
	$httpProvider.defaults.headers.post = {};
	$httpProvider.defaults.headers.put = {};
	$httpProvider.defaults.headers.patch = {};
}]);*/

angular.module('farmbuild.wfs.demo.auth', [])

	.run(function($rootScope){
		$rootScope.appVersion = farmbuild.webservices.examples.version;
		
	})

	.controller('WfsAuthCtrl', function ($scope, $http) {

		$scope.reset = function() {
			$scope.error = false;
			$scope.errorMessages = [];
			$scope.messages = [];
			$scope.token = null;
		}


		$scope.authenticate = function (authUrl, clientId, clientSecret, authScope) {
			$scope.reset();

			//Authenticate to retrieve token
			var data = { grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret, scope: authScope };
			var res = $http({
				method: 'POST',
				url: authUrl,
				data: data,
				transformRequest: function(obj) {
					var str = [];
					for(var p in obj)
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					return str.join("&");
				},
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			res.success(function(data, status, headers, config) {
				$scope.messages.push("Successfully authenticated.  Token is:");
				$scope.token = data.access_token
				
			});
			res.error(function(data, status, headers, config) {
				$scope.error = true;
        var errorToDisplay = "Error authenticating, status returned "+status ;
        switch(status){
          case 400:{
            errorToDisplay ='One or more of the field values are invalid.';
            break;
          }
          case 401:{
            errorToDisplay ='Access has been denied please contact the FarmBuild administrator.';
            break;
          }
        }
				$scope.errorMessages.push(errorToDisplay);
			});
		}

		$scope.reset();

		$scope.authScopes = farmbuild.webservices.examples.authentication.scopes;

		//For dev only
		$scope.authUrl = 'https://oauth-fb.agriculture.vic.gov.au/core/connect/token';
		$scope.clientId, $scope.clientSecret;
		$scope.authScope = 'SOIL_AREA_SERVICES';

	});
