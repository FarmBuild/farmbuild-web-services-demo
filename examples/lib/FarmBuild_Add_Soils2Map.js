//Simply Include this JS file in the head of you index.htm mapping page.
//<script src="../path to file/FarmBuild_Add_Soils2Map.js"></script>
//Add the farmBuildSoilsWFS() call to the "function _createFarmLayers" return new Layers function [otherLayers,
//and functions called to the Layer group, farmBuildSoilsWFS()]



function farmBuildSoilsWFS(){
		console.log("1");
		//setTimeout(function(){
		var ext3 = _farmExtents.join();
		
		 var group0 = [255,255,0,0.5];
		var group1 = [255,255,0,0.5];
		var group2 = [255,255,0,0.5];
		var group3 = [0,153,0,0.5];
		var group4 = [0,153,0,0.5];
		var group5 = [0,102,204,0.5];
		var group6 = [0,102,204,0.5];
      
		var groupLevels = {
        	'0': group0, // 
        	'1':group1, // 
        	'2': group2, // 
        	'3':group3, // 
        	'4': group4, // 
        	'5': group5, // 
        	'6': group6 // 
        
      		};

	var defaultStyle = new ol.style.Style({
        fill: new ol.style.Fill({
          color: [250,250,250,1]
        }),
        stroke: new ol.style.Stroke({
          color: [220,220,220,1],
          width: 1
        })
      });
		var styleCache = {};
		function styleFunction(feature, resolution) {
        
        var level = feature.get('group_');
        // if there is no group or its one we don't recognize,
        // return the default style (in an array!)
        if (!level || !groupLevels[level]) {
          return [defaultStyle];
        }
        // check the cache and create a new style for the group
        // level if its not been created before.
        if (!styleCache[level]) {
          styleCache[level] = new ol.style.Style({
            fill: new ol.style.Fill({
              color: groupLevels[level]
            }),
            stroke: defaultStyle.stroke
          });
        }
        // at this point, the style for the current group is in the cache
        // so return it (as an array!)
        return [styleCache[level]];
      }


		
		var sourceVector = new ol.source.Vector({
		loader: function(ext3, resolution, projection) {
		$.ajax('https://farmbuild-wfs.agriculture.vic.gov.au/geoserver/farmbuild/wfs',{
			type: 'GET',
			data: {
				service: 'WFS',
				version: '1.1.0',
				request: 'GetFeature',
				typename: 'farmbuild:soils',
				srsname: 'EPSG:3857',
				outputFormat: 'text/javascript',
				bbox: ext3.join(',') + ',EPSG:3857'
				},
			dataType: 'jsonp',
			jsonpCallback:'callback:loadFeatures',
			jsonp:'format_options'
			});
		},
		strategy: ol.loadingstrategy.tile(new ol.tilegrid.createXYZ({
			maxZoom: 19
			})),
	});

			window.loadFeatures = function(response) {
			geoJSON = new ol.format.GeoJSON();
			sourceVector.addFeatures(geoJSON.readFeatures(response));
			};

			layerVector = new ol.layer.Vector({
			
			source: sourceVector,
			title: 'FarmBuild Soils',
			style: styleFunction
        
      
    });
	return layerVector;
	layerVector.setZIndex(0);
	//}, 1030);
	
	}
