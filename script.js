// Check mobile browser
function mobileCheck() {
    return document.body.classList.contains("mobile");
}

if (window.matchMedia) {
    var setMode = function () {
        if (mql.matches) {
            document.body.classList.remove("desktop");
            document.body.classList.add("mobile");
        } else {
            document.body.classList.remove("mobile");
            document.body.classList.add("desktop");
        }
    };
    var mql = matchMedia("(max-width: 500px), (max-height: 500px)");
    setMode();
    mql.addListener(setMode);
} else {
    document.body.classList.add("desktop");
}

// Main
mapboxgl.accessToken =
    "pk.eyJ1IjoibGFrc2h5YWplZXQiLCJhIjoiY2t1cWx1N3dtMGFtYzJ2bG5jZDRleDJhOCJ9.QZg1Hzuvo5s50PgCgbTKCQ";

const map = new mapboxgl.Map({
    container: "map", // container ID
    center: [79.51, 29.1869],
    zoom: 10,
    pitch: 45,
    style: "mapbox://styles/lakshyajeet/ckuw9z93k25ny18o6538pmjps",
    cooperativeGestures: false,
    attributionControl: false,
    hash: true,
    maxPitch: 45,
});

const Geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    countries: "in",
    collapsed: !mobileCheck(),
    autocomplete: true,
    localGeocoderOnly: true,
    localGeocoder: coordinatesGeocoder,
    externalGeocoder: forwardGeocoder,
    zoom: 15,
    placeholder: "Search a place",
    mapboxgl: mapboxgl,
});

document.getElementById("geocoder").appendChild(Geocoder.onAdd(map));

map.addControl(
    new mapboxgl.AttributionControl({
        customAttribution: "Map Haldwani",
    })
);

map.addControl(
    new mapboxgl.ScaleControl({ maxWidth: 80, unit: "metric" }),
    "bottom-right"
);

if (!mobileCheck()) {
    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(
        new watergis.MapboxExportControl({
            PageSize: watergis.Size.A3,
            PageOrientation: watergis.PageOrientation.Portrait,
            Format: watergis.Format.PNG,
            DPI: watergis.DPI[96],
            Crosshair: true,
            PrintableArea: true,
        }),
        "top-right"
    );
    map.addControl(new ZoomControl(), "bottom-right");
}

map.addControl(new terrainToggle({ minpitchzoom: 15 }));

map.addControl(
    new CompassControl(),
    mobileCheck() ? "top-right" : "bottom-right"
);

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

map.on("load", () => {
    map.flyTo({
        center: [79.51, 29.1969],
        zoom: 14,
        pitch: 0,

        essential: true,
        bearing: 20,
        speed: 1,
        curve: 1,
        easing: function (t) {
            return t;
        },
    });
});

var trafficControl = new MapboxTraffic();

map.on("styledata", (e) => {
    if (map.hasControl(trafficControl)) {
        map.removeControl(trafficControl);
    }
    map.addControl(trafficControl);

    if (!map.getSource("mapbox-dem")) {
        map.addSource("mapbox-dem", {
            type: "raster-dem",
            url: "mapbox://mapbox.mapbox-terrain-dem-v1",
            tileSize: 512,
            maxzoom: 14,
        });
    }
});
map.addControl(new MapboxStyleSwitcherControl());

function sidebarOpen() {
    const sidebar = document.getElementById("leftSidebar");

    const sidebarContent = document.getElementById("leftSidebarContent");
    sidebarContent.innerHTML = `<image src="media/loader.gif" width="50px"></image>`;
    sidebarContent.classList.remove("sidebarLoaded");
    sidebar.classList.add("sidebarLoading");

    if (sidebar.classList.contains("collapsed")) {
        sidebar.classList.remove("collapsed");
        map.easeTo({
            padding: { left: 300 },
            duration: 1000, // In ms. This matches the CSS transition duration property.
        });
    }
}

var clickMarkerStatus = false;
var clickMarker;

map.on("click", "poi-label", (e) => {
    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const name = e.features[0].properties.name;

    var osm_id = e.features[0].id;

    osm_id = Math.floor(osm_id / 10);

    sidebarOpen();
    map.flyTo({
        center: coordinates,
        curve: 1.1,
        speed: 0.8,
        easing(t) {
            return t;
        },
    });

    clickMarker = new mapboxgl.Marker({
        draggable: false,
        color: "red",
    })
        .setLngLat(coordinates)
        .addTo(map);
    clickMarkerStatus = true;

    fetch(
        `https://nominatim.openstreetmap.org/lookup?osm_ids=R${osm_id},W${osm_id},N${osm_id}&format=geojson&extratags=1`
    )
        .then((response) => response.json())
        .then((data) => {
            if (data.features[0] != null) {
                var text = `<p>${data.features[0].properties.display_name}</p>
                    <p>Category: ${data.features[0].properties.category}</p>
                     <p>Type: ${data.features[0].properties.type}</p>`;

                // Sidebar content
                const sidebarContent =
                    document.getElementById("leftSidebarContent");
                sidebarContent.innerHTML = "";
                sidebarContent.classList.remove("sidebarLoading");
                sidebarContent.classList.add("sidebarLoaded");
                // Image Placeholder
                const imagePlaceholder = document.createElement("div");
                imagePlaceholder.classList.add("imagePlaceholder");
                imagePlaceholder.id = "imagePlaceholder";
                sidebarContent.appendChild(imagePlaceholder);
                if (data.features[0].properties.extratags.mapillary != null) {
                    var { Viewer } = mapillary;

                    var viewer = new Viewer({
                        component: {
                            attribution: false,
                            sequence: false,
                        },
                        accessToken:
                            "MLY|5156776201075853|07025564e8b4277b5f54d38b3807eedc",
                        container: "imagePlaceholder", // the ID of our container defined in the HTML body
                        imageId:
                            data.features[0].properties.extratags.mapillary,
                    });
                } else {
                    if (data.features[0].properties.extratags.image != null) {
                        imagePlaceholder.innerHTML = `<img src="${data.features[0].properties.extratags.image}" width="100%">`;
                    } else {
                        imagePlaceholder.innerHTML = `<image src="media/default_img.svg"></image>`;
                    }
                }
                // Name & Type
                const nameElement = document.createElement("div");
                nameElement.innerHTML = `<h2 style="margin-bottom:0px">${name}</h2>
                 <p style="color:grey; margin : 0; padding-top:0">${data.features[0].properties.type} (${data.features[0].properties.category})</p>`;
                sidebarContent.appendChild(nameElement);
                // Address
                const addressElement = document.createElement("div");
                addressElement.innerHTML = `<h3 style="margin-bottom:0px">Address</h3>
                <p style="margin : 0; padding-top:0">${data.features[0].properties.display_name}</p>`;
                sidebarContent.appendChild(addressElement);
                // Phone
                if (data.features[0].properties.extratags.phone != null) {
                    const phoneElement = document.createElement("div");
                    phoneElement.innerHTML = `<h3 style="margin-bottom:0px">Phone</h3>
                    <p style="margin : 0; padding-top:0">${data.features[0].properties.extratags.phone}</p>`;
                    sidebarContent.appendChild(phoneElement);
                }
                // Website
                if (data.features[0].properties.extratags.website != null) {
                    const websiteElement = document.createElement("div");
                    websiteElement.innerHTML = `<h3 style="margin-bottom:0px">Website</h3>
                    <p style="margin : 0; padding-top:0">${data.features[0].properties.extratags.website}</p>`;
                    sidebarContent.appendChild(websiteElement);
                }
            } else {
                var text = name;
            }
        });
});

function sidebarClose() {
    const sidebar = document.getElementById("leftSidebar");
    if (!sidebar.classList.contains("collapsed")) {
        sidebar.classList.add("collapsed");
        map.easeTo({
            padding: { left: 0 },
            duration: 1000, // In ms. This matches the CSS transition duration property.
        });
    }
    if (clickMarkerStatus) {
        clickMarker.remove();
        clickMarkerStatus = false;
    }
}

map.on("preclick", sidebarClose);
// Change the cursor to a pointer when the mouse is over the places layer.
map.on("mouseenter", "poi-label", () => {
    map.getCanvas().style.cursor = "pointer";
});

// Change it back to a pointer when it leaves.
map.on("mouseleave", "poi-label", () => {
    map.getCanvas().style.cursor = "";
});
