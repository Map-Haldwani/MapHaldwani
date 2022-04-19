// Check mobile browser
function mobileCheck() {
    let check = false;
    (function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4)
            )
        )
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
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
    map.addControl(new ZoomControl(), "bottom-right");
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
