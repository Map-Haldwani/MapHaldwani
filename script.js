// JavaScript Document
var locationiq_api_key = "pk.dd3b88b07ee111e15e0af9588de10ba7";
var locationiq_api_url = "https://api.locationiq.com/v1/autocomplete.php";

mapboxgl.accessToken =
    "pk.eyJ1IjoibGFrc2h5YWplZXQiLCJhIjoiY2t1cWx1N3dtMGFtYzJ2bG5jZDRleDJhOCJ9.QZg1Hzuvo5s50PgCgbTKCQ";

const map = new mapboxgl.Map({
    container: "map", // container ID
    center: [79.51, 29.1869],
    zoom: 10,
    pitch: 0,
    style: "mapbox://styles/lakshyajeet/ckuw9z93k25ny18o6538pmjps",
    cooperativeGestures: false,
    attributionControl: false,
});

var placeEmoji = {
    amenity: {
        school: "🏫",
        college: "🎓",
        events_venue: "🎉",
        university: "🎓",
        bank: "🏦",
        place_of_worship: "🛐",
        restaurant: "🍴",
        cafe: "🍰",
        bar: "🍺",
        pharmacy: "💊",
        atm: "🏧",
    },
    shop: { bakery: "🍞" },
    tourism: { hotel: "🏨" },
    boundary: { national_park: "🏞️" },
    highway: { residential: "🛣️", motorway: "🛣️" },
    landuse: { religious: "🛐", cemetery: "⚰️", residential: "🏠" },
    leisure: { park: "⛲", playground: "🛝", pitch: "🏃", sports_centre: "🏊" },
    railway: { station: "🚉" },
};

function placeTypeEmoji(type, placeClass) {
    if (placeClass in placeEmoji) {
        if (type in placeEmoji[placeClass]) {
            return placeEmoji[placeClass][type];
        }
    }
    return "🔗 ";
}

async function forwardGeocoder(query) {
    // Location IQ
    const locationiq_request_url =
        locationiq_api_url +
        "?" +
        "q=" +
        query +
        "&key=" +
        locationiq_api_key +
        "&viewbox=79%2C29%2C80%2C29.54" +
        "&bounded=1" +
        "&limit=5" +
        "&countrycodes=in";
    var success = false;

    const locationiq_result = await fetch(locationiq_request_url)
        .then((response) => {
            return response.json();
        })
        .then((actualdata) => {
            if (actualdata["error"]) {
                return;
            } else {
                const matchingFeatures = [];
                for (const feature of actualdata) {
                    feature["place_name"] =
                        placeTypeEmoji(feature.type, feature.class) +
                        feature.display_name;
                    feature["center"] = [feature.lon, feature.lat];
                    feature["place_type"] = feature.type;
                    matchingFeatures.push(feature);
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
        return locationiq_result;
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

map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        countries: "in",
        collapsed: true,
        autocomplete: true,
        localGeocoder: coordinatesGeocoder,
        externalGeocoder: forwardGeocoder,
        zoom: 15,
        placeholder: "Search a place",
        mapboxgl: mapboxgl,
    }),
    "top-left"
);

map.addControl(
    new mapboxgl.AttributionControl({
        customAttribution: "Map Haldwani",
    })
);
map.addControl(
    new mapboxgl.ScaleControl({ maxWidth: 80, unit: "metric" }),
    "bottom-right"
);
map.addControl(
    new mapboxgl.NavigationControl({
        visualizePitch: true,
    }),
    "bottom-right"
);
map.addControl(new mapboxgl.FullscreenControl());
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
    }),
    "bottom-right"
);

function toggleSidebar(id) {
    const elem = document.getElementById(id);
    // Add or remove the 'collapsed' CSS class from the sidebar element.
    // Returns boolean "true" or "false" whether 'collapsed' is in the class list.
    const collapsed = elem.classList.toggle("collapsed");
    const padding = {};
    // 'id' is 'right' or 'left'. When run at start, this object looks like: '{left: 300}';
    padding[id] = collapsed ? 0 : 300; // 0 if collapsed, 300 px if not. This matches the width of the sidebars in the .sidebar CSS class.
    // Use `map.easeTo()` with a padding option to adjust the map's center accounting for the position of sidebars.
    map.easeTo({
        padding: padding,
        duration: 1000, // In ms. This matches the CSS transition duration property.
    });
}

map.on("load", () => {
    map.flyTo({
        center: [79.51, 29.1969],
        zoom: 14,
        pitch: 45,

        essential: true,
        bearing: 20,
        speed: 1.2,
        curve: 1.1,
        easing: function (t) {
            return t;
        },
    });
});

map.addControl(new MapboxTraffic());
map.addControl(new MapboxStyleSwitcherControl());
