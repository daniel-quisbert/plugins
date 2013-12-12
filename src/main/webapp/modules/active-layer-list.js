define([ "jquery", "message-bus", "layout", "map", "jquery-ui" ], function($, bus, layout, map) {
	var divActiveLayersContainer = layout.activeLayers;

    var divActiveLayers = $("<div/>").attr("id", "active_layers");

    // Accordion header
	var h3Title = $("<h3/>").html("Selected layers");
	divActiveLayers.append(h3Title);

    // div that contains all the active layers with sliders
	var div = $("<div/>");
	divActiveLayers.append(div);
	//div.empty();

    var table = $('<table style="width:100%;margin:auto"></table>');
	div.append(table);

    // create the accordion
    divActiveLayers.accordion({
		collapsible: false,
		autoHeight: false,
		animated: false,
        heightStyle: "content",
		create: function (event, ui) {
			$('#active_layers_pane .ui-icon-triangle-1-s').hide();
			//updateActiveLayersPane(mapContexts);
		}
	});

    divActiveLayersContainer.append(divActiveLayers);

	bus.listen("layer-visibility", function(event, layerInfo, visibility) {
        var layerId = layerInfo.id;

        function addLayer(layerId) {
            // Layer label
            var tr1 = $('<tr id="' + layerId + '_tr1"><td>' + layerInfo.name + '</td></tr>')

            // Transparency slider
            var transparencyDiv = $('<div style="margin-top:4px; margin-bottom:12px;" id="' + 'layerId' + '_transparency_slider"></div>');
            var td = $('<td colspan="2"></td>');
            td.append(transparencyDiv);
            var tr2 = $('<tr id="' + layerId + '_tr2"></tr>');
            tr2.append(td);

            // Append elements to table
            table.append(tr1);
            table.append(tr2);

            //layers = contextConf.layers;
            $(transparencyDiv).slider({
                min: 0,
                max: 100,
                value: 100 * map.getLayer(layerId).opacity,
                slide: function (event, ui) {
                    bus.send("transparency-slider-changed", [layerInfo, ui.value / 100]);
                }
            });
            divActiveLayers.accordion("refresh");
        }

        function delLayer(layerId) {
            $('#' + layerId + '_tr1').remove();
            $('#' + layerId + '_tr2').remove();
        }

        if (visibility) { addLayer(layerId); }
        else { delLayer(layerId); }
    });

	bus.listen("show-active-layer-list", function(event, groupInfo) {
//        divActiveLayers.accordion({
//            collapsible: false,
//            autoHeight: false,
//            animated: false,
//            clearStyle: true,
//            create: function (event, ui) {
//                $('#active_layers_pane .ui-icon-triangle-1-s').hide();
//                //updateActiveLayersPane(mapContexts);
//            }
//        });
        divActiveLayers.accordion("refresh");
		divActiveLayersContainer.show();
	});

	bus.listen("hide-active-layer-list", function(event, groupInfo) {
        divActiveLayersContainer.hide();
	});

	return divActiveLayers;
});
