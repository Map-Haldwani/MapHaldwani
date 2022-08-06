async function forwardGeocoder(query) {

    let nominatim_url =
        'https://nominatim.openstreetmap.org/search?q=' +
        query +
        '&countrycodes=in&limit=5&format=geojson&polygon_geojson=1&addressdetails=1';

    var success = false;

    const nominatim_result = await fetch(nominatim_url)
        .then((response) => {
            return response.json();
        })
        .then((actualdata) => {
            if (actualdata["error"]) {
                return;
            } else {
                const matchingFeatures = [];
                for (const feature of actualdata.features) {
                    let center = [
                        feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
                        feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2
                    ];

                    let point = {
                        place_name: feature.properties.display_name,
                        center: center,
                        place_type: [feature.properties.type],

                    };

                    matchingFeatures.push(point);
                }
                success = true;
                return matchingFeatures;
            }
        })
        .catch((error) => {
            console.log(`Location IQ Error ${error}`);
            return;
        });

    if (success) {
        return nominatim_result;
    } else {
        return Promise.reject(
            new Error("failed to fetch data from Location IQ")
        );
    }
}


const coordinatesGeocoder = function (query) {
    // Match anything which looks like
    // decimal degrees coordinate pair.
    const matches = query.match(
        /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
    );
    if (!matches) {
        return null;
    }

    function coordinateFeature(lng, lat) {
        return {
            center: [lng, lat],
            geometry: {
                type: "Point",
                coordinates: [lng, lat],
            },
            place_name: "Lat: " + lat + " Lng: " + lng,
            place_type: ["coordinate"],
            properties: {},
            type: "Feature",
        };
    }

    const coord1 = Number(matches[1]);
    const coord2 = Number(matches[2]);
    const geocodes = [];

    if (coord1 < -90 || coord1 > 90) {
        // must be lng, lat
        geocodes.push(coordinateFeature(coord1, coord2));
    }

    if (coord2 < -90 || coord2 > 90) {
        // must be lat, lng
        geocodes.push(coordinateFeature(coord2, coord1));
    }

    if (geocodes.length === 0) {
        // else could be either lng, lat or lat, lng
        geocodes.push(coordinateFeature(coord1, coord2));
        geocodes.push(coordinateFeature(coord2, coord1));
    }

    return geocodes;
};
