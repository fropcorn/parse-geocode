
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
			var locationName = parsedResponse.results[0].formatted_address;
			response.success(locationName);
		} else {
			response.error("Could not fetch results " + httpResponse.status)
		}
	},function(httpResponse) {
		response.error('Request failed with response code ' + httpResponse.status)
	});
});