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
