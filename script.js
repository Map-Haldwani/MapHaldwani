// JavaScript Document

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
        speed: 1,
        curve: 1.1,
        easing: function (t) {
            return t;
        },
    });
});

map.addControl(new MapboxTraffic());
map.addControl(new MapboxStyleSwitcherControl());

map.on("click", "poi-label", (e) => {
    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const name = e.features[0].properties.name;

    var osm_id = e.features[0].id;

    osm_id = Math.floor(osm_id / 10);

    fetch(
        `https://nominatim.openstreetmap.org/lookup?osm_ids=R${osm_id},W${osm_id},N${osm_id}&format=geojson`
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.features[0] != null) {
                var text =
                    data.features[0].properties.display_name +
                    "\nCategory:" +
                    data.features[0].properties.category +
                    "\nType:" +
                    data.features[0].properties.type;
            } else {
                var text = name;
            }

            console.log(text);

            const description = `<h3>${name}</h3>` + `<a>${text}</a>`;
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });
});

// Change the cursor to a pointer when the mouse is over the places layer.
map.on("mouseenter", "poi-label", () => {
    map.getCanvas().style.cursor = "pointer";
});

// Change it back to a pointer when it leaves.
map.on("mouseleave", "poi-label", () => {
    map.getCanvas().style.cursor = "";
});
