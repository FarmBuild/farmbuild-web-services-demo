'use strict';

/**
 * This module is developed using the JavaScript MVC framework called AngularJS.
 * You can find out more about AngularJS at https://angularjs.org.
 * This module formats the FarmData soils into a UI friendly object.  It is not part of the API and is strictly used by
 * the soil area demonstration page to display data in a more readable format.
 */
angular.module('farmbuild.webservices.examples.soil')
    .factory('soilarea', function ($log) {

        var soilarea = {};

        $log.info('soilarea');

        /**
         * Formats the farm soil area section in the farm data block to display in the example page.
         *
         * @param soilareaResponse      FarmData response from Soil Area service
         * @returns the formatted farm soil area data
         */
        soilarea.farmSoilArea = function (soilareaResponse) {
            $log.info('soilarea>>farmSoilArea');
            var farmSoilTypes = [];

            var farmSoil = soilareaResponse.soils;

            if (!farmSoil || !farmSoil.soilAreas) {
                return undefined;
            }


            var soilTypesInfo = farmSoil.soilAreas.types;

            if (!soilTypesInfo) {
                return undefined;
            }

            farmSoilTypes = soilTypes(soilTypesInfo);


            return {
                dateLastUpdated: farmSoil.dateLastUpdated,
                types: farmSoilTypes
            };
        };

        /**
         * Formats the Farm data soil type block to display in the example page
         * @param typesInfo         Farm data block soils.soilArea section
         * @returns the formatted farm soil type data
         */
        var soilTypes = function (typesInfo) {
            $log.info('soilarea>>soilTypes');

            if (!typesInfo) {
                return undefined;
            }

            var soilTypes = [];
            for (var i = 0; i < typesInfo.length; i++) {
                var area = 0,
                    description = '',
                    soilGroup = 0,
                    soilClass = '',
                    singleSoilType = typesInfo[i];

                soilTypes.push({
                    area: singleSoilType.area,
                    description: singleSoilType.description,
                    soilGroup: singleSoilType.soilGroup,
                    soilClass: singleSoilType.soilClass

                });
            }
            ;
            return soilTypes;
        }

        /**
         * Formats the Farm data paddock soil block to display in the example page
         *
         * @param soilareaResponse  FarmData response from Soil Area service
         * @returns the formatted farm paddocks soil type data
         */
        soilarea.paddockSoilArea = function (soilareaResponse) {

            $log.info('soilareaxy>> paddockSoilArea ');

            if (!soilareaResponse) {
                return undefined;
            }


            var paddocksInfo = soilareaResponse.paddocks;

            if (!paddocksInfo) {
                return undefined;
            }

            var paddockSoils = [];
            for (var i = 0; i < paddocksInfo.length; i++) {
                var paddockName = 0,
                    paddockSoilTypes = [],
                    singlePaddock = paddocksInfo[i];

                paddockSoilTypes = soilTypes(singlePaddock.soils.soilAreas.types);
                var temp;

                paddockSoils.push({
                    paddockName: singlePaddock.name,
                    soilTypes: paddockSoilTypes
                });
            }


            return paddockSoils;

        };

        return soilarea;
    });