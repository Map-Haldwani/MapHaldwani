// JavaScript Document
var opencage_api_key = "bb4cb8615cb445cc8c59c02826af5b86";
var opencage_api_url = "https://api.opencagedata.com/geocode/v1/geojson";

var locationiq_api_key = "pk.dd3b88b07ee111e15e0af9588de10ba7";
var locationiq_api_url = "https://api.locationiq.com/v1/autocomplete.php";

var geokeo_api_key = "25e5bf55d654beeb5bd8e922c56601be";
var geokeo_api_url = "https://geokeo.com/geocode/v1/search.php";

mapboxgl.accessToken =
    "pk.eyJ1IjoibGFrc2h5YWplZXQiLCJhIjoiY2t1cWx1N3dtMGFtYzJ2bG5jZDRleDJhOCJ9.QZg1Hzuvo5s50PgCgbTKCQ";

const OSMstyle = {
    version: 8,
    sources: {
        osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
                '<a target="_blank" rel="noopener" href="http://openstreetmap.org">@OpenStreetMap</a> <a target="_blank" rel="noopener" href="https://www.openstreetmap.org/edit#map=13/29.2069/79.5237">Edit this map</a>',
        },
    },
    layers: [
        {
            id: "osm",
            type: "raster",
            source: "osm",
        },
    ],
};

const map = new mapboxgl.Map({
    container: "map", // container ID
    center: [79.51, 29.1869],
    zoom: 10,
    pitch: 45,
    style: "mapbox://styles/lakshyajeet/ckuw9z93k25ny18o6538pmjps",
    cooperativeGestures: true,
});

const layerList = document.getElementById("menu");
const inputs = layerList.getElementsByTagName("input");

for (const input of inputs) {
    input.onclick = (layer) => {
        const layerId = layer.target;
        if (layer.target.id == "osm") {
            map.setStyle(OSMstyle);
        } else {
            map.setStyle(layerId.value);
        }
    };
}

var placeEmoji = {
    school: "🏫",
    park: "🌲",
    events_venue: "🎉",
    highway: "🛣️",
};

function placeTypeEmoji(type) {
    if (type in placeEmoji) {
        return placeEmoji[type];
    }
    return "🔗";
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

    const locationiq_result = await fetch(locationiq_request_url)
        .then((response) => {
            return response.json();
        })
        .then((actualdata) => {
            if (actualdata["error"]) {
                return;
            }
            const matchingFeatures = [];
            for (const feature of actualdata) {
                feature["place_name"] =
                    placeTypeEmoji(feature.type) + feature.display_name;
                feature["center"] = [feature.lon, feature.lat];
                feature["place_type"] = feature.type;
                matchingFeatures.push(feature);
            }
            return matchingFeatures;
        })
        .catch((error) => {
            success = false;
            console.log(`Location IQ Error ${error}`);
        });

    return locationiq_result;
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

const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    localGeocoder: coordinatesGeocoder,
    externalGeocoder: forwardGeocoder,
    zoom: 15,
    placeholder: "Search a place",
    mapboxgl: mapboxgl,
});

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

document.getElementById("geocoder").appendChild(geocoder.onAdd(map));

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
        pitch: 60,

        essential: true,
        bearing: 20,
        speed: 0.8,
        curve: 0.8,
        easing: function (t) {
            return t;
        },
    });
});
