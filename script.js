// Check mobile browser
function mobileCheck() {
    return document.body.classList.contains("mobile");
}

const Geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    countries: "in",
    autocomplete: true,
    localGeocoderOnly: true,
    localGeocoder: coordinatesGeocoder,
    externalGeocoder: forwardGeocoder,
    zoom: 15,
    placeholder: "Search a place",
    mapboxgl: mapboxgl,
});

if (window.matchMedia) {
    var setMode = function () {
        if (mql.matches) {
            document.body.classList.remove("desktop");
            document.body.classList.add("mobile");
            Geocoder.options.collapsed = false;
        } else {
            document.body.classList.remove("mobile");
            document.body.classList.add("desktop");
            Geocoder.options.collapsed = true;
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

map.addControl(new MapboxTraffic());
map.addControl(new MapboxStyleSwitcherControl());

var mapillaryWindowToggle = false;

document.addEventListener("mapillaryWindowToggled", () => {
    if (mapillaryWindowToggle) {
    }
});

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
                if (data.features[0].properties.extratags.mapillary != null) {
                    sidebarContent.appendChild(imagePlaceholder);
                    var { Viewer } = mapillary;

                    var viewer = new Viewer({
                        component: {
                            attribution: true,
                            sequence: false,
                            cover: false,
                            cache: false,
                            directions: false,
                            zoom: false,
                        },
                        accessToken: mapillatyAccesToken,
                        container: "imagePlaceholder", // the ID of our container defined in the HTML body
                        imageId:
                            data.features[0].properties.extratags.mapillary,
                    });
                } else {
                    if (data.features[0].properties.extratags.image != null) {
                        sidebarContent.appendChild(imagePlaceholder);
                        imagePlaceholder.innerHTML = `<img src="${data.features[0].properties.extratags.image}" width="100%">`;
                    }
                }
                // Name & Type
                const nameElement = document.createElement("div");
                nameElement.classList.add("sidebarContentName");
                nameElement.innerHTML = `<p style="font-size:2em; margin-bottom:0px">${name}</p>
                 <p style="color:grey; margin : 0; padding-top: 0.1em">${data.features[0].properties.type} (${data.features[0].properties.category})</p>`;
                sidebarContent.appendChild(nameElement);

                // Horizontal Line
                const horizontalLine = document.createElement("hr");
                horizontalLine.classList.add("sidebarContentHorizontalLine");
                sidebarContent.appendChild(horizontalLine);

                // Address
                const addressElement = document.createElement("div");
                addressElement.classList.add("sidebarContentTable");
                addressElement.innerHTML = `<div class="sidebarIconDiv"><svg id="sidebarIcons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z"/></svg></div>
                <div class="sidebarIconText">${data.features[0].properties.display_name}</div>`;
                sidebarContent.appendChild(addressElement);

                // Phone
                if (data.features[0].properties.extratags.phone != null) {
                    const phoneElement = document.createElement("div");
                    phoneElement.classList.add("sidebarContentTable");
                    phoneElement.innerHTML = `<div class="sidebarIconDiv"><svg id="sidebarIcons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M511.2 387l-23.25 100.8c-3.266 14.25-15.79 24.22-30.46 24.22C205.2 512 0 306.8 0 54.5c0-14.66 9.969-27.2 24.22-30.45l100.8-23.25C139.7-2.602 154.7 5.018 160.8 18.92l46.52 108.5c5.438 12.78 1.77 27.67-8.98 36.45L144.5 207.1c33.98 69.22 90.26 125.5 159.5 159.5l44.08-53.8c8.688-10.78 23.69-14.51 36.47-8.975l108.5 46.51C506.1 357.2 514.6 372.4 511.2 387z"/></svg></div>
                    <div class="sidebarIconText">${data.features[0].properties.extratags.phone}</div>`;
                    sidebarContent.appendChild(phoneElement);
                }

                // Website
                if (data.features[0].properties.extratags.website != null) {
                    const websiteElement = document.createElement("div");
                    websiteElement.classList.add("sidebarContentTable");
                    websiteElement.innerHTML = `<div class="sidebarIconDiv"><svg id="sidebarIcons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM51.68 295.1L83.41 301.5C91.27 303.1 99.41 300.6 105.1 294.9L120.5 279.5C132 267.1 151.6 271.1 158.9 285.8L168.2 304.3C172.1 313.9 182.8 319.1 193.5 319.1C208.7 319.1 219.6 305.4 215.2 290.8L209.3 270.9C204.6 255.5 216.2 240 232.3 240H234.6C247.1 240 260.5 233.3 267.9 222.2L278.6 206.1C284.2 197.7 283.9 186.6 277.8 178.4L261.7 156.9C251.4 143.2 258.4 123.4 275.1 119.2L292.1 114.1C299.6 113.1 305.7 107.8 308.6 100.6L324.9 59.69C303.4 52.12 280.2 48 255.1 48C141.1 48 47.1 141.1 47.1 256C47.1 269.4 49.26 282.5 51.68 295.1L51.68 295.1zM450.4 300.4L434.6 304.9C427.9 306.7 420.8 304 417.1 298.2L415.1 295.1C409.1 285.7 398.7 279.1 387.5 279.1C376.4 279.1 365.1 285.7 359.9 295.1L353.8 304.6C352.4 306.8 350.5 308.7 348.2 309.1L311.1 330.1C293.9 340.2 286.5 362.5 294.1 381.4L300.5 393.8C309.1 413 331.2 422.3 350.1 414.9L353.5 413.1C363.6 410.2 374.8 411.8 383.5 418.1L385 419.2C422.2 389.7 449.1 347.8 459.4 299.7C456.4 299.4 453.4 299.6 450.4 300.4H450.4zM156.1 367.5L188.1 375.5C196.7 377.7 205.4 372.5 207.5 363.9C209.7 355.3 204.5 346.6 195.9 344.5L163.9 336.5C155.3 334.3 146.6 339.5 144.5 348.1C142.3 356.7 147.5 365.4 156.1 367.5V367.5zM236.5 328.1C234.3 336.7 239.5 345.4 248.1 347.5C256.7 349.7 265.4 344.5 267.5 335.9L275.5 303.9C277.7 295.3 272.5 286.6 263.9 284.5C255.3 282.3 246.6 287.5 244.5 296.1L236.5 328.1zM321.7 120.8L305.7 152.8C301.7 160.7 304.9 170.4 312.8 174.3C320.7 178.3 330.4 175.1 334.3 167.2L350.3 135.2C354.3 127.3 351.1 117.6 343.2 113.7C335.3 109.7 325.6 112.9 321.7 120.8V120.8z"/></svg></div>
                    <div class="sidebarIconText">${data.features[0].properties.extratags.website}</div>`;
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

map.addControl(new mapillaryViewerButton(), "top-right");
