"use strict";

angular.module("farmbuild.farmdata", []);

window.farmbuild = {
    farmdata: {}
};

"use strict";

angular.module("farmbuild.farmdata").factory("FarmData", function() {
    var FarmData = {}, defaults = {
        name: "My new farm",
        geometry: {
            type: "Polygon",
            crs: "EPSG:4283",
            coordinates: []
        }
    }, create = function(name) {
        return {
            version: 1,
            dateCreated: new Date(),
            dateLastUpdated: new Date(),
            name: name ? name : defaults.name,
            geometry: angular.copy(defaults.geometry),
            area: 0
        };
    };
    FarmData.defaultValues = function() {
        return angular.copy(defaults);
    };
    FarmData.isFarmData = function(farmData) {
        if (!angular.isDefined(farmData)) {
            return false;
        }
        if (!angular.isObject(farmData)) {
            return false;
        }
        if (!farmData.hasOwnProperty("name")) {
            return false;
        }
        return true;
    };
    FarmData.create = function(name) {
        return create(name);
    };
    window.farmbuild.farmdata = FarmData;
    return FarmData;
});