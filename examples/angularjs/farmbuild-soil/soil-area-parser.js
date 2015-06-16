'use strict';
angular.module('farmbuild.webservices.examples.soil')
  .factory('soilarea', function ($log) {

    var soilarea = {};

    $log.info('soilarea');

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


      return{
        dateLastUpdated: farmSoil.dateLastUpdated,
        types: farmSoilTypes
      };
    };


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