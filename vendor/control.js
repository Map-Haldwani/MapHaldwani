const svgPointer = `
<svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fill-rule="evenodd">
        <path d="M0 0h24v24H0z"/>
        <path fill="#f44336" d="M12 3l4 8H8z"/>
        <path fill="#9E9E9E" d="M12 21l-4-8h8z"/>
    </g>
</svg>
`;
function iconPointer() {
    return new DOMParser().parseFromString(svgPointer, "image/svg+xml")
        .firstChild;
}

const svgMinus = `
<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="#505050" width="20" height="20">
    <rect fill="none" height="24" width="24"/>
    <path d="M18,13H6c-0.55,0-1-0.45-1-1l0,0c0-0.55,0.45-1,1-1h12c0.55,0,1,0.45,1,1l0,0C19,12.55,18.55,13,18,13z"/>
</svg>
`;
function iconMinus() {
    return new DOMParser().parseFromString(svgMinus, "image/svg+xml")
        .firstChild;
}
const svgPlus = `
<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="#505050" width="20" height="20">
    <rect fill="none" height="24" width="24"/>
    <path d="M18,13h-5v5c0,0.55-0.45,1-1,1l0,0c-0.55,0-1-0.45-1-1v-5H6c-0.55,0-1-0.45-1-1l0,0c0-0.55,0.45-1,1-1h5V6 c0-0.55,0.45-1,1-1l0,0c0.55,0,1,0.45,1,1v5h5c0.55,0,1,0.45,1,1l0,0C19,12.55,18.55,13,18,13z"/>
</svg>
`;
function iconPlus() {
    return new DOMParser().parseFromString(svgPlus, "image/svg+xml").firstChild;
}

class Base {
    constructor() {
        this.node = document.createElement("div");
        this.node.classList.add("mapboxgl-ctrl");
        this.node.classList.add("mapboxgl-ctrl-group");
        this.node.classList.add("mapbox-control");
    }
    addButton(button) {
        this.node.appendChild(button.node);
    }
    addClassName(className) {
        this.node.classList.add(className);
    }
    removeClassName(className) {
        this.node.classList.remove(className);
    }
    onAddControl() {
        // extend
    }
    onRemoveControl() {
        // extend
    }
    onAdd(map) {
        this.map = map;
        this.onAddControl();
        return this.node;
    }
    onRemove() {
        this.onRemoveControl();
        this.node.parentNode.removeChild(this.node);
        this.map = undefined;
    }
}

class Button {
    constructor() {
        this.node = document.createElement("button");
        this.node.type = "button";
        this.icon = null;
    }
    setIcon(icon) {
        this.icon = icon;
        this.node.appendChild(icon);
    }
    setText(text) {
        this.node.textContent = text;
    }
    onClick(callback) {
        this.node.addEventListener("click", callback);
    }
    addClassName(className) {
        this.node.classList.add(className);
    }
    removeClassName(className) {
        this.node.classList.remove(className);
    }
}

class CompassControl extends Base {
    constructor(options) {
        var _a;
        super();
        this.button = new Button();
        this.instant =
            (_a =
                options === null || options === void 0
                    ? void 0
                    : options.instant) !== null && _a !== void 0
                ? _a
                : true;
        this.syncRotate = this.syncRotate.bind(this);
    }
    insert() {
        this.addClassName("mapbox-compass");
        if (!this.instant) this.node.hidden = true;
        this.button.setIcon(iconPointer());
        this.button.onClick(() => {
            this.map.easeTo({ bearing: 0, pitch: 0 });
        });
        this.addButton(this.button);
    }
    onAddControl() {
        this.insert();
        this.syncRotate();
        this.map.on("rotate", this.syncRotate);
    }
    syncRotate() {
        const angle = this.map.getBearing() * -1;
        if (!this.instant) {
            this.node.hidden = angle === 0;
        }
        this.button.icon.style.transform = `rotate(${angle}deg)`;
    }
}

class ZoomControl extends Base {
    constructor() {
        super();
        this.zoomIn = new Button();
        this.zoomOut = new Button();
    }
    insert() {
        this.addClassName("mapbox-zoom");
        this.zoomIn.setIcon(iconPlus());
        this.zoomIn.onClick(() => this.map.zoomIn());
        this.zoomOut.setIcon(iconMinus());
        this.zoomOut.onClick(() => this.map.zoomOut());
        this.addButton(this.zoomIn);
        this.addButton(this.zoomOut);
    }
    onAddControl() {
        this.insert();
    }
}

class PitchToggle {
    constructor({ bearing = -10, pitch = 65, minpitchzoom = 15 }) {
        this._bearing = bearing;
        this._pitch = pitch;
        this._minpitchzoom = minpitchzoom;
    }

    onAdd(map) {
        this._map = map;
        let _this = this;

        this._btn = document.createElement("button");
        this._btn.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d";
        this._btn.type = "button";
        this._btn["aria-label"] = "Toggle Pitch";
        this._btn.onclick = function () {
            if (map.getPitch() <= 45) {
                let minZoom = _this._minpitchzoom;
                const curZoom = map.getZoom();

                if (minZoom && curZoom < minZoom) {
                    minZoom = curZoom;
                }
                map.setMaxPitch(65);
                map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
                map.easeTo({
                    pitch: _this._pitch,
                    bearing: _this._bearing,
                    zoom: minZoom,
                    duration: 1000,
                });
                delay(1000).then(() => {
                    map.setMinPitch(65);
                    _this._btn.className =
                        "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-2d";
                });
            } else {
                map.setMinPitch(0);
                map.setTerrain();
                map.easeTo({
                    pitch: 0,
                    bearing: 0,
                    duration: 1000,
                });
                delay(1000).then(() => {
                    map.setMaxPitch(45);
                    _this._btn.className =
                        "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d";
                });
            }

            map.on("styledata", (e) => {
                if (
                    _this._btn.className ===
                        "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-2d" &&
                    !map.getTerrain()
                ) {
                    map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
                }
                if (
                    _this._btn.className ===
                        "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d" &&
                    map.getTerrain()
                ) {
                    map.setTerrain();
                }
            });
        };

        this._container = document.createElement("div");
        this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
        this._container.appendChild(this._btn);

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}
