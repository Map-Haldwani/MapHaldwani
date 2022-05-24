mapillatyAccesToken = "MLY|7352363038169201|4e02e9cd8030a2fa229fb42825fb46bb";

var mapillaryStatus = false;

var mapillaryFullscreen = false;

class mapillaryViewerButton {
    onAdd(map) {
        this.map = map;
        this._btn = document.createElement("button");
        this._btn.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-mapillary";
        this._btn.type = "button";
        this._btn.onclick = function () {
            if (!mapillaryStatus) {
                mapillaryStatus = true;

                if (!map.getSource("mapillaryImages")) {
                    map.addSource("mapillaryImages", {
                        type: "vector",
                        tiles: [
                            `https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=${mapillatyAccesToken}`,
                        ],
                        minzoom: 6,
                        maxzoom: 14,
                        promoteId: { image: "id" },
                    });
                }
                if (!map.getLayer("mapillary-images")) {
                    map.addLayer({
                        id: "mapillary-images",
                        type: "circle",
                        source: "mapillaryImages",
                        "source-layer": "image",
                        paint: {
                            "circle-radius": [
                                "case",
                                ["boolean", ["feature-state", "hover"], false],
                                7,
                                6,
                            ],
                            "circle-opacity": 1,
                            "circle-color": [
                                "case",
                                [
                                    "boolean",
                                    ["feature-state", "selected"],
                                    false,
                                ],
                                "#00bcff",
                                "#05CB63",
                            ],
                            "circle-stroke-color": "#ffffff",
                            "circle-stroke-width": [
                                "case",
                                ["boolean", ["feature-state", "hover"], false],
                                3,
                                0,
                            ],
                        },
                    });
                }
                if (!map.getLayer("mapillary-images-360")) {
                    map.addLayer(
                        {
                            id: "mapillary-images-360",
                            type: "circle",
                            source: "mapillaryImages",
                            "source-layer": "image",
                            paint: {
                                "circle-radius": 20,
                                "circle-opacity": 0.4,
                                "circle-color": [
                                    "case",
                                    [
                                        "boolean",
                                        ["feature-state", "selected"],
                                        false,
                                    ],
                                    "#00bcff",
                                    "#05CB63",
                                ],
                            },
                            filter: ["==", "is_pano", true],
                            minzoom: 17,
                        },
                        "mapillary-images"
                    );
                }

                if (!map.getSource("mapillarySequences")) {
                    map.addSource("mapillarySequences", {
                        type: "vector",
                        tiles: [
                            `https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=${mapillatyAccesToken}`,
                        ],
                        minzoom: 6,
                        maxzoom: 14,
                        promoteId: { sequence: "id" },
                    });
                }
                if (!map.getLayer("mapillary-sequences")) {
                    map.addLayer(
                        {
                            id: "mapillary-sequences",
                            type: "line",
                            source: "mapillarySequences",
                            "source-layer": "sequence",
                            layout: {
                                "line-cap": "round",
                                "line-join": "round",
                            },
                            paint: {
                                "line-opacity": 0.6,
                                "line-color": [
                                    "case",
                                    [
                                        "boolean",
                                        ["feature-state", "selected"],
                                        false,
                                    ],
                                    "#00bcff",
                                    "#05CB63",
                                ],
                                "line-width": 2,
                            },
                        },
                        "mapillary-images"
                    );
                }
            } else {
                mapillaryStatus = false;
                document.getElementById("imageWindow").style.visibility =
                    "hidden";
                document
                    .getElementById("mapWindow")
                    .classList.remove("mapillaryWindowEnabled");

                map.removeLayer("mapillary-images");
                map.removeLayer("mapillary-images-360");
                map.removeLayer("mapillary-sequences");
                map.removeSource("mapillaryImages");
                map.removeSource("mapillarySequences");

                originalMarker.remove();
                cameraMarker.remove();

                window.dispatchEvent(new Event("resize"));
            }
        };

        this._container = document.createElement("div");
        this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
        this._container.appendChild(this._btn);

        map.on("styledata", () => {
            if (mapillaryStatus) {
                if (!map.getSource("mapillaryImages")) {
                    map.addSource("mapillaryImages", {
                        type: "vector",
                        tiles: [
                            `https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=${mapillatyAccesToken}`,
                        ],
                        minzoom: 6,
                        maxzoom: 14,
                        promoteId: { image: "id" },
                    });
                }
                if (!map.getLayer("mapillary-images")) {
                    map.addLayer({
                        id: "mapillary-images",
                        type: "circle",
                        source: "mapillaryImages",
                        "source-layer": "image",
                        paint: {
                            "circle-radius": [
                                "case",
                                ["boolean", ["feature-state", "hover"], false],
                                7,
                                6,
                            ],
                            "circle-opacity": 1,
                            "circle-color": [
                                "case",
                                [
                                    "boolean",
                                    ["feature-state", "selected"],
                                    false,
                                ],
                                "#00bcff",
                                "#05CB63",
                            ],
                            "circle-stroke-color": "#ffffff",
                            "circle-stroke-width": [
                                "case",
                                ["boolean", ["feature-state", "hover"], false],
                                3,
                                0,
                            ],
                        },
                    });
                }
                if (!map.getLayer("mapillary-images-360")) {
                    map.addLayer(
                        {
                            id: "mapillary-images-360",
                            type: "circle",
                            source: "mapillaryImages",
                            "source-layer": "image",
                            paint: {
                                "circle-radius": 20,
                                "circle-opacity": 0.4,
                                "circle-color": [
                                    "case",
                                    [
                                        "boolean",
                                        ["feature-state", "selected"],
                                        false,
                                    ],
                                    "#00bcff",
                                    "#05CB63",
                                ],
                            },
                            filter: ["==", "is_pano", true],
                            minzoom: 17,
                        },
                        "mapillary-images"
                    );
                }

                if (!map.getSource("mapillarySequences")) {
                    map.addSource("mapillarySequences", {
                        type: "vector",
                        tiles: [
                            `https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=${mapillatyAccesToken}`,
                        ],
                        minzoom: 6,
                        maxzoom: 14,
                        promoteId: { sequence: "id" },
                    });
                }
                if (!map.getLayer("mapillary-sequences")) {
                    map.addLayer(
                        {
                            id: "mapillary-sequences",
                            type: "line",
                            source: "mapillarySequences",
                            "source-layer": "sequence",
                            layout: {
                                "line-cap": "round",
                                "line-join": "round",
                            },
                            paint: {
                                "line-opacity": 0.6,
                                "line-color": [
                                    "case",
                                    [
                                        "boolean",
                                        ["feature-state", "selected"],
                                        false,
                                    ],
                                    "#00bcff",
                                    "#05CB63",
                                ],
                                "line-width": 2,
                            },
                        },
                        "mapillary-images"
                    );
                }
            }
        });

        const mapillaryPopup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: "mapillaryPopup",
        });

        let hoveredImageId = null;

        map.on("mouseenter", "mapillary-images", (e) => {
            map.getCanvas().style.cursor = "pointer";

            hoveredImageId = e.features[0].id;
            map.setFeatureState(
                {
                    id: hoveredImageId,
                    source: "mapillaryImages",
                    sourceLayer: "image",
                },
                {
                    hover: true,
                }
            );

            const coordinates = e.features[0].geometry.coordinates.slice();
            const imageID = e.features[0].properties.id;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            mapillaryPopup
                .setLngLat(coordinates)
                .setHTML(`<image src="media/loader.gif" width="50px"></image>`)
                .addTo(map);

            fetch(
                `https://graph.mapillary.com/${imageID}?access_token=${mapillatyAccesToken}&fields=thumb_256_url`
            ).then((response) => {
                response.json().then((data) => {
                    mapillaryPopup.setHTML(
                        `<img src="${data.thumb_256_url}" class="mapillaryPreviewImg"/>`
                    );
                });
            });
        });
        map.on("mouseleave", "mapillary-images", (e) => {
            map.getCanvas().style.cursor = "";
            mapillaryPopup.remove();

            map.setFeatureState(
                {
                    id: hoveredImageId,
                    source: "mapillaryImages",
                    sourceLayer: "image",
                },
                {
                    hover: false,
                }
            );
        });

        // ----------------------------------- Viewer Window -----------------------------------

        var { Viewer } = mapillary;

        var mapillaryViewer = new Viewer({
            accessToken: mapillatyAccesToken,
            container: "mapillaryWindow",
        });

        map.on("click", "mapillary-images", (e) => {
            document.getElementById("imageWindow").style.visibility = "visible";

            document
                .getElementById("mapWindow")
                .classList.add("mapillaryWindowEnabled");

            window.dispatchEvent(new Event("resize"));
            mapillaryViewer.moveTo(e.features[0].properties.id);
        });

        // Helper Functions
        const RAD2DEG = 180 / Math.PI;
        const DEG2RAD = Math.PI / 180;

        function rotateArc(bearing) {
            return `rotateZ(${bearing}deg)`;
        }
        function makeMapboxMarker(options) {
            const size = `${2 * options.radius}px`;
            const circle = document.createElement("div");
            circle.style.border = `2px solid ${options.color}`;
            circle.style.backgroundColor = "#ff861b";
            circle.style.height = `${size}`;
            circle.style.borderWidth = "3px";
            circle.style.borderRadius = "50%";
            circle.style.width = `${size}`;
            circle.style.zIndex = "4";
            return new mapboxgl.Marker({
                element: circle,
                rotationAlignment: "map",
            });
        }
        function makeArc(fov) {
            const radius = 45;
            const centerX = 50;
            const centerY = 50;

            const fovRad = DEG2RAD * fov;

            const arcStart = -Math.PI / 2 - fovRad / 2;
            const arcEnd = arcStart + fovRad;

            const startX = centerX + radius * Math.cos(arcStart);
            const startY = centerY + radius * Math.sin(arcStart);

            const endX = centerX + radius * Math.cos(arcEnd);
            const endY = centerY + radius * Math.sin(arcEnd);

            const center = `M ${centerX} ${centerY}`;
            const line = `L ${startX} ${startY}`;
            const arc = `A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;

            return `${center} ${line} ${arc} Z`;
        }
        function makeCamera(bearing, fov) {
            const path = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );

            path.setAttribute("d", makeArc(fov));
            path.setAttribute("fill", "#ffc01b");

            const svg = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );
            svg.setAttribute("viewBox", "0 0 100 100");
            svg.appendChild(path);

            svg.style.height = "100%";
            svg.style.width = "100%";
            svg.style.transform = rotateArc(bearing);

            const container = document.createElement("div");
            container.style.height = "60px";
            container.style.width = "60px";
            container.appendChild(svg);

            return container;
        }

        // Markers
        const originalMarker = makeMapboxMarker({ radius: 7, color: "#fff" }); //white ring

        // Camera
        const camera = makeCamera(0, 90);

        const cameraMarker = new mapboxgl.Marker({
            color: "#ffffff",
            element: camera,
            rotationAlignment: "map",
        });

        // Event Function
        let activeSequenceId = null;
        let activeImages = null;

        const onImage = (image) => {
            document.getElementById("mapillaryWindowLoader").style.display =
                "none";

            const lngLat = [image.lngLat.lng, image.lngLat.lat];

            map.flyTo({ center: lngLat });

            const originalPos = [
                image.originalLngLat.lng,
                image.originalLngLat.lat,
            ];
            originalMarker.setLngLat(originalPos).addTo(map);
            cameraMarker.setLngLat(originalPos).addTo(map);

            if (activeSequenceId !== image.sequenceId) {
                if (activeSequenceId) {
                    activeImages.forEach((feature) => {
                        map.setFeatureState(
                            {
                                id: feature.id,
                                source: "mapillaryImages",
                                sourceLayer: "image",
                            },
                            {
                                selected: false,
                            }
                        );
                    });

                    map.setFeatureState(
                        {
                            id: activeSequenceId,
                            source: "mapillarySequences",
                            sourceLayer: "sequence",
                        },
                        {
                            selected: false,
                        }
                    );
                }
            }

            activeSequenceId = image.sequenceId;

            activeImages = map.querySourceFeatures("mapillaryImages", {
                filter: ["==", "sequence_id", activeSequenceId],
                sourceLayer: "image",
            });
            activeImages.forEach((feature) => {
                map.setFeatureState(
                    {
                        id: feature.id,
                        source: "mapillaryImages",
                        sourceLayer: "image",
                    },
                    {
                        selected: true,
                    }
                );
            });

            map.setFeatureState(
                {
                    id: activeSequenceId,
                    source: "mapillarySequences",
                    sourceLayer: "sequence",
                },
                {
                    selected: true,
                }
            );
        };

        const onFov = async () => {
            const viewerContainer = mapillaryViewer.getContainer();
            const height = viewerContainer.offsetHeight;
            const width = viewerContainer.offsetWidth;
            const aspect = height === 0 ? 0 : width / height;

            const verticalFov =
                DEG2RAD * (await mapillaryViewer.getFieldOfView());
            const horizontalFov =
                RAD2DEG * Math.atan(aspect * Math.tan(0.5 * verticalFov)) * 2;

            const path = camera.querySelector("path");
            path.setAttribute("d", makeArc(horizontalFov));
        };

        const onPov = async () => {
            const pov = await mapillaryViewer.getPointOfView();
            const svg = camera.querySelector("svg");
            svg.style.transform = rotateArc(pov.bearing);
        };

        // Viewer Events

        mapillaryViewer.on("load", async () => {
            const image = await mapillaryViewer.getImage();

            onImage(image);

            await onFov();
            await onPov();
        });

        mapillaryViewer.on("image", (event) => onImage(event.image));

        mapillaryViewer.on("fov", onFov);

        window.addEventListener("resize", onFov);

        mapillaryViewer.on("pov", onPov);

        mapillaryViewer.on("dataloading", (event) => {
            if (event.loading) {
                document.getElementById("mapillaryWindowLoader").style.display =
                    "block";
            }
        });

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

function toggleMapImageWindow() {
    sidebarClose();
    document.getElementById("mapWindow").classList.toggle("mainWindow");
    document.getElementById("mapWindow").classList.toggle("subWindow");
    document.getElementById("imageWindow").classList.toggle("mainWindow");
    document.getElementById("imageWindow").classList.toggle("subWindow");

    if (document.getElementById("mapWindow").classList.contains("mainWindow")) {
        mapillaryFullscreen = false;
        console.log("mapillaryFullscreen: " + mapillaryFullscreen);
    } else {
        mapillaryFullscreen = true;
        console.log("mapillaryFullscreen: " + mapillaryFullscreen);
    }

    $("#mapillaryWindowToggleButton").appendTo(".subWindow");

    document.dispatchEvent(new Event("mapillaryWindowToggled"));
    window.dispatchEvent(new Event("resize"));
}
