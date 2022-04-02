// JavaScript Document
var locationiq_api_key = "pk.dd3b88b07ee111e15e0af9588de10ba7";
var locationiq_api_url = "https://api.locationiq.com/v1/autocomplete.php";

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
    pitch: 0,
    style: "mapbox://styles/lakshyajeet/ckuw9z93k25ny18o6538pmjps",
    cooperativeGestures: false,
    attributionControl: false,
});

var placeEmoji = {
    amenity: { school: "🏫", events_venue: "🎉" },
    boundary: { national_park: "🏞️" },
    park: "🌲",
    highway: { resedential: "🏠" },
};

function placeTypeEmoji(type, placeClass) {
    if (type in placeEmoji) {
        return placeEmoji[type];
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

// test xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
class MapboxStyleSwitcherControl {
    constructor(styles) {
        this.styles = styles || MapboxStyleSwitcherControl.DEFAULT_STYLES;
    }
    getDefaultPosition() {
        const defaultPosition = "bottom-left";
        return defaultPosition;
    }
    onAdd(map) {
        this.controlContainer = document.createElement("div");
        this.controlContainer.classList.add("mapboxgl-ctrl");
        this.controlContainer.classList.add("mapboxgl-ctrl-group");

        const mapStyleContainer = document.createElement("div");
        const styleButton = document.createElement("button");

        mapStyleContainer.classList.add("mapboxgl-style-list");

        for (const style of this.styles) {
            const styleElement = document.createElement("button");
            styleElement.innerText = style.title;
            styleElement.classList.add(
                style.title.replace(/[^a-z0-9-]/gi, "_")
            );
            styleElement.dataset.uri = JSON.stringify(style.uri);
            styleElement.addEventListener("click", (event) => {
                const srcElement = event.srcElement;
                map.setStyle(JSON.parse(srcElement.dataset.uri));
                mapStyleContainer.style.display = "none";
                styleButton.style.display = "block";
                const elms = mapStyleContainer.getElementsByClassName("active");
                while (elms[0]) {
                    elms[0].classList.remove("active");
                }
                srcElement.classList.add("active");
            });

            if (style.title === MapboxStyleSwitcherControl.DEFAULT_STYLE) {
                styleElement.classList.add("active");
            }

            mapStyleContainer.appendChild(styleElement);
        }
        styleButton.classList.add("mapboxgl-ctrl-icon");
        styleButton.classList.add("mapboxgl-style-switcher");
        styleButton.addEventListener("click", () => {
            styleButton.style.display = "none";
            mapStyleContainer.style.display = "block";
        });

        document.addEventListener("click", (event) => {
            if (!this.controlContainer.contains(event.target)) {
                mapStyleContainer.style.display = "none";
                styleButton.style.display = "block";
            }
        });

        this.controlContainer.appendChild(styleButton);
        this.controlContainer.appendChild(mapStyleContainer);

        return this.controlContainer;
    }
    onRemove() {
        return;
    }
}
MapboxStyleSwitcherControl.DEFAULT_STYLE = "Streets";
MapboxStyleSwitcherControl.DEFAULT_STYLES = [
    {
        title: "Satellite",
        uri: "mapbox://styles/mapbox/satellite-v9",
    },
    {
        title: "Satellite Streets",
        uri: "mapbox://styles/lakshyajeet/ckuw6ho682rig18qp8ldx5wkl",
    },
    {
        title: "Day",
        uri: "mapbox://styles/mapbox/navigation-day-v1",
    },
    {
        title: "Night",
        uri: "mapbox://styles/lakshyajeet/ckvrvl4w10gkj14pl1u4js7ar",
    },
    {
        title: "Outdoors",
        uri: "mapbox://styles/mapbox/outdoors-v10",
    },
    {
        title: "Streets",
        uri: "mapbox://styles/lakshyajeet/ckuw9z93k25ny18o6538pmjps",
    },
    {
        title: "OSM",
        uri: OSMstyle,
    },
];

map.addControl(new MapboxStyleSwitcherControl());
