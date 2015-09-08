var _ = require('underscore');


var getLocationName = function(addressComponents) {
	var result = "";

	_.each(addressComponents, function(addressComponent) {
		if (_.contains(addressComponent.types, 'street_number')) {
			result += addressComponent.short_name + " ";
		} else if (_.contains(addressComponent.types, 'route') ||
			_.contains(addressComponent.types, 'neighborhood') ||
			_.contains(addressComponent.types, 'sublocality')) {
			result += addressComponent.short_name + ", ";
		} else if (_.contains(addressComponent.types, 'administrative_area_level_1')) {
			result += addressComponent.short_name;
		}
	});

	return result;
};

Parse.Cloud.define('getLocationNameFromCoordinate', function(request, response) {
	var latlng = request.params.latitude + "," + request.params.longitude;
	Parse.Cloud.httpRequest({
		url: 'https://maps.googleapis.com/maps/api/geocode/json',
		params: {
			latlng: latlng,
			key: '{APIKEY}'
		}
	}).then(function(httpResponse) {
		var parsedResponse = httpResponse.data;
		if (parsedResponse.status === "OK") {
			var addressComponents = parsedResponse.results[0].address_components;
			var locationName = getLocationName(addressComponents);
			response.success(locationName);
		} else {
			response.error("Could not fetch results " + httpResponse.status)
		}
	},function(httpResponse) {
		response.error('Request failed with response code ' + httpResponse.status)
	});
});


