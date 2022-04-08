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
        uri: "mapbox://styles/mapbox/satellite-v9",
    },
    {
        title: "Satellite Streets",
        uri: "mapbox://styles/lakshyajeet/ckuw6ho682rig18qp8ldx5wkl",
    },
    {
        title: "Navigation Guidance Day",
        uri: "mapbox://styles/mapbox/navigation-guidance-day-v4",
    },
    {
        title: "Navigation Guidance Night",
        uri: "mapbox://styles/mapbox/navigation-guidance-night-v4",
    },
    {
        title: "Traffic Day",
        uri: "mapbox://styles/mapbox/traffic-day-v2",
    },
    {
        title: "Traffic Night",
        uri: "mapbox://styles/mapbox/traffic-night-v2",
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
        uri: OSMstyle,
    },
];
