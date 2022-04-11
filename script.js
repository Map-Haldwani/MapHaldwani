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
    hash: true,
    maxPitch: 50,
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
map.addControl(new CompassControl(), "bottom-right");
map.addControl(new ZoomControl(), "bottom-right");
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

var trafficControl = new MapboxTraffic();

map.on("styledata", (e) => {
    if (map.hasControl(trafficControl)) {
        map.removeControl(trafficControl);
    }
    map.addControl(trafficControl);
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
            padding: { leftSidebar: 300 },
            duration: 1000, // In ms. This matches the CSS transition duration property.
        });
    }
}

map.on("click", "poi-label", (e) => {
    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const name = e.features[0].properties.name;

    var osm_id = e.features[0].id;

    osm_id = Math.floor(osm_id / 10);

    sidebarOpen();

    fetch(
        `https://nominatim.openstreetmap.org/lookup?osm_ids=R${osm_id},W${osm_id},N${osm_id}&format=geojson`
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.features[0] != null) {
                var text = `<p>${data.features[0].properties.display_name}</p>
                    <p>Category: ${data.features[0].properties.category}</p>
                     <p>Type: ${data.features[0].properties.type}</p>`;
            } else {
                var text = name;
            }

            const sidebarContent =
                document.getElementById("leftSidebarContent");
            sidebarContent.innerHTML = "";
            sidebarContent.classList.remove("sidebarLoading");
            sidebarContent.classList.add("sidebarLoaded");

            const imagePlaceholder = document.createElement("div");
            imagePlaceholder.classList.add("imagePlaceholder");
            imagePlaceholder.innerHTML = `<image src="media/default_img.svg"></image>`;
            sidebarContent.appendChild(imagePlaceholder);

            const nameElement = document.createElement("div");
            nameElement.style.display = "block";
            nameElement.innerHTML = `<h2 style="margin-bottom:0px">${name}</h2>
            <p style="color:grey; margin : 0; padding-top:0">${data.features[0].properties.type} (${data.features[0].properties.category})</p>`;
            sidebarContent.appendChild(nameElement);

            const description = `<h3>${name}</h3>` + text;
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
map.on("preclick", () => {
    const sidebar = document.getElementById("leftSidebar");
    if (!sidebar.classList.contains("collapsed")) {
        sidebar.classList.add("collapsed");
        map.easeTo({
            padding: { leftSidebar: 0 },
            duration: 1000, // In ms. This matches the CSS transition duration property.
        });
    }
});
// Change the cursor to a pointer when the mouse is over the places layer.
map.on("mouseenter", "poi-label", () => {
    map.getCanvas().style.cursor = "pointer";
});

// Change it back to a pointer when it leaves.
map.on("mouseleave", "poi-label", () => {
    map.getCanvas().style.cursor = "";
});
