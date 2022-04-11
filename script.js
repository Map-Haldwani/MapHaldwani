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
            padding: { left: 300 },
            duration: 1000, // In ms. This matches the CSS transition duration property.
        });
    }
}

map.on("click", "poi-label", (e) => {
    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const name = e.features[0].properties.name;

    var osm_id = e.features[0].id;

    console.log(coordinates);

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
                if (data.features[0].properties.extratags.image != null) {
                    imagePlaceholder.innerHTML = `<img src="${data.features[0].properties.extratags.image}" width="100%">`;
                } else {
                    imagePlaceholder.innerHTML = `<image src="media/default_img.svg"></image>`;
                }
                sidebarContent.appendChild(imagePlaceholder);
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

function sidebarClose() {
    const sidebar = document.getElementById("leftSidebar");
    if (!sidebar.classList.contains("collapsed")) {
        sidebar.classList.add("collapsed");
        map.easeTo({
            padding: { left: 0 },
            duration: 1000, // In ms. This matches the CSS transition duration property.
        });
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
