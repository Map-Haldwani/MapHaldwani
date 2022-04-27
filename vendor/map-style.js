const OSMstyle = {
    sources: {
        osm: {
            type: "raster",
            //tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tiles: [
                "https://mt1.google.com/vt/lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
            ],
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

const basemapEnum = "OSM:Standard";
const apiKey =
    "AAPK59b0e7a2a4174bf693ac98dabf0e125cgEmkmruuiJUzi4PV-qkvDCaLlWB3STXBwe082mfi7Kg2sU8nsTZbaK4hLlXKUDyv";

const osmStyle = `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${basemapEnum}?type=style&token=${apiKey}`;

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
MapboxStyleSwitcherControl.DEFAULT_STYLE = "Default";
MapboxStyleSwitcherControl.DEFAULT_STYLES = [
    {
        title: "Satellite",
        uri: satellite,
    },
    {
        title: "Satellite Streets",
        uri: satelliteStreet,
    },
    {
        title: "Streets Dark",
        uri: "mapbox://styles/lakshyajeet/cl2a1kcwo000715p51nzrs2z0",
    },
    {
        title: "Outdoors",
        uri: "mapbox://styles/lakshyajeet/cl1jcx2n8000g14rvri6u5djk",
    },
    {
        title: "Default",
        uri: "mapbox://styles/lakshyajeet/ckuw9z93k25ny18o6538pmjps",
    },
    {
        title: "OpenStreetMap",
        uri: osmStyle,
    },
];
