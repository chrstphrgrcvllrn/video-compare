import "./style.css";

const VIDEO_EXT = [".mp4", ".mov", ".webm", ".avi", ".ogg"];
const THEME_KEY = "video-preview-theme";
const CONTROLS_KEY = "video-preview-controls";

const ICON = {
    upload: '<path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />',
    trash: '<path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />',
    refresh:
        '<path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />',
    tag: '<path d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path d="M6 6h.008v.008H6V6z" />',
    sliders:
        '<path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />',
    funnel: '<path d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />',
    sun: '<path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />',
    moon: '<path d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />',
};

function icon(name) {
    return (
        '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        ICON[name] +
        "</svg>"
    );
}

const state = {
    items: [],
    speed: 1,
    sort: { key: "name" },
    labelsVisible: true,
    scrubberVisible: true,
    filterSelected: false,
    dimensionFilter: "all",
    sizeScale: 0.25,
    theme: "light",
};

const app = document.getElementById("app");

app.innerHTML = `
    <div class="page">
        <div class="panel">
            <header class="panel-header">
                <div class="header-text">
                    <p class="subtitle">Select local video files to preview, sort, and compare — nothing leaves your browser.</p>
                </div>
                <div class="header-actions">
                    <button id="themeToggle" class="icon-button" type="button" title="Toggle theme" aria-label="Toggle theme">
                        <span class="icon-sun">${icon("sun")}</span>
                        <span class="icon-moon">${icon("moon")}</span>
                    </button>
                </div>
            </header>

            <div id="dropzone">
                <input id="fileInput" type="file" accept="video/*" multiple hidden />
                <button id="selectBtn" class="btn btn-primary" type="button">${icon("upload")}<span class="btn-label">Select Videos</span></button>
                <span id="dropHint">or drag &amp; drop video files here</span>
            </div>

            <div id="controls" hidden>
                <div class="sort-group">
                    <label for="sortField">Sort by</label>
                    <select id="sortField">
                        <option value="name">Name</option>
                        <option value="dimension">Dimension</option>
                    </select>
                </div>
                <div class="sort-group">
                    <label for="dimensionFilter">Dimension</label>
                    <select id="dimensionFilter">
                        <option value="all">All</option>
                    </select>
                </div>
                <div class="sort-group">
                    <label for="sizeSelect">Size</label>
                    <select id="sizeSelect">
                        <option value="1">100%</option>
                        <option value="0.75">75%</option>
                        <option value="0.5">50%</option>
                        <option value="0.25" selected>25%</option>
                        <option value="0.15">15%</option>
                    </select>
                </div>
                <button id="refreshBtn" class="chip-button" type="button">${icon("refresh")}<span class="btn-label">Refresh</span></button>
                <button id="labelsBtn" class="chip-button active" type="button">${icon("tag")}<span class="btn-label">Labels</span></button>
                <button id="scrubberBtn" class="chip-button active" type="button">${icon("sliders")}<span class="btn-label">Scrubber</span></button>
                <button id="compareBtn" class="chip-button" type="button">${icon("funnel")}<span class="btn-label">Show Selected Only</span></button>
                <div id="speedToggle">
                    <button class="speed-button active" data-speed="1" type="button">1x</button>
                    <button class="speed-button" data-speed="0.5" type="button">0.5x</button>
                    <button class="speed-button" data-speed="0.25" type="button">0.25x</button>
                </div>
                <button id="clearBtn" class="btn btn-secondary" type="button">${icon("trash")}<span class="btn-label">Clear</span></button>
            </div>

            <div id="videoGrid"></div>
        </div>
    </div>
`;

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const selectBtn = document.getElementById("selectBtn");
const clearBtn = document.getElementById("clearBtn");
const themeToggle = document.getElementById("themeToggle");
const controls = document.getElementById("controls");
const sortField = document.getElementById("sortField");
const dimensionFilter = document.getElementById("dimensionFilter");
const sizeSelect = document.getElementById("sizeSelect");
const refreshBtn = document.getElementById("refreshBtn");
const labelsBtn = document.getElementById("labelsBtn");
const scrubberBtn = document.getElementById("scrubberBtn");
const compareBtn = document.getElementById("compareBtn");
const compareLabel = compareBtn.querySelector(".btn-label");
const videoGrid = document.getElementById("videoGrid");

function isVideoFile(file) {
    if (file.type && file.type.startsWith("video/")) return true;
    const lower = file.name.toLowerCase();
    return VIDEO_EXT.some((ext) => lower.endsWith(ext));
}

function extractName(filename) {
    return filename
        .replace(/^Z-/i, "")
        .replace(/\d+x\d+/gi, "")
        .replace(/[_-]+/g, " ")
        .replace(/\.(mp4|mov|webm|avi|ogg)$/i, "")
        .trim();
}

function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
    return m + ":" + s;
}

function updateToolbarVisibility() {
    controls.hidden = state.items.length === 0;
}

function updateCompareButtonLabel() {
    const count = videoGrid.querySelectorAll(".video-item.selected").length;
    compareLabel.textContent = state.filterSelected
        ? "Show All"
        : "Show Selected Only" + (count > 0 ? " (" + count + ")" : "");
}

function refreshDimensionOptions() {
    const dims = new Set();

    videoGrid.querySelectorAll(".video-item").forEach((el) => {
        if (el.dataset.width !== "0" && el.dataset.height !== "0") {
            dims.add(el.dataset.width + "×" + el.dataset.height);
        }
    });

    const sortedDims = Array.from(dims).sort();
    const previousValue = dimensionFilter.value;

    dimensionFilter.innerHTML =
        '<option value="all">All</option>' +
        sortedDims.map((d) => '<option value="' + d + '">' + d + "</option>").join("");

    dimensionFilter.value = sortedDims.includes(previousValue) ? previousValue : "all";
    state.dimensionFilter = dimensionFilter.value;
}

function applySizeToItem(wrapper, video) {
    const nativeW = Number(wrapper.dataset.width);
    const nativeH = Number(wrapper.dataset.height);
    if (!nativeW || !nativeH) return;

    const w = Math.round(nativeW * state.sizeScale);
    const h = Math.round(nativeH * state.sizeScale);

    video.width = w;
    video.height = h;
    wrapper.style.width = w + "px";
}

function applySizeToAll() {
    videoGrid.querySelectorAll(".video-item").forEach((wrapper) => {
        applySizeToItem(wrapper, wrapper.querySelector("video"));
    });
}

function applyFilters() {
    videoGrid.querySelectorAll(".video-item").forEach((el) => {
        const matchesSelection = !state.filterSelected || el.classList.contains("selected");
        const dimKey = el.dataset.width + "×" + el.dataset.height;
        const matchesDimension =
            state.dimensionFilter === "all" || dimKey === state.dimensionFilter;
        el.style.display = matchesSelection && matchesDimension ? "" : "none";
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    state.theme = theme;
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch {
        /* localStorage unavailable */
    }
}

function initTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    state.theme = current === "dark" ? "dark" : "light";
}

function saveControlsState() {
    try {
        localStorage.setItem(
            CONTROLS_KEY,
            JSON.stringify({
                speed: state.speed,
                sortKey: state.sort.key,
                labelsVisible: state.labelsVisible,
                scrubberVisible: state.scrubberVisible,
                filterSelected: state.filterSelected,
                sizeScale: state.sizeScale,
            }),
        );
    } catch {
        /* localStorage unavailable */
    }
}

function loadControlsState() {
    try {
        const raw = localStorage.getItem(CONTROLS_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function applyControlsState(saved) {
    if (!saved) return;

    if (saved.sortKey === "name" || saved.sortKey === "dimension") {
        state.sort.key = saved.sortKey;
        sortField.value = saved.sortKey;
    }

    if (typeof saved.labelsVisible === "boolean") {
        state.labelsVisible = saved.labelsVisible;
        videoGrid.classList.toggle("hide-labels", !state.labelsVisible);
        labelsBtn.classList.toggle("active", state.labelsVisible);
    }

    if (typeof saved.scrubberVisible === "boolean") {
        state.scrubberVisible = saved.scrubberVisible;
        videoGrid.classList.toggle("hide-scrubber", !state.scrubberVisible);
        scrubberBtn.classList.toggle("active", state.scrubberVisible);
    }

    if (typeof saved.filterSelected === "boolean") {
        state.filterSelected = saved.filterSelected;
        compareBtn.classList.toggle("active", state.filterSelected);
        updateCompareButtonLabel();
    }

    if (saved.speed === 1 || saved.speed === 0.5 || saved.speed === 0.25) {
        state.speed = saved.speed;
        document.querySelectorAll(".speed-button").forEach((btn) => {
            btn.classList.toggle("active", Number(btn.dataset.speed) === saved.speed);
        });
    }

    const validSizes = [1, 0.75, 0.5, 0.25, 0.15];
    if (validSizes.includes(saved.sizeScale)) {
        state.sizeScale = saved.sizeScale;
        sizeSelect.value = String(saved.sizeScale);
        applySizeToAll();
    }
}

function buildItem(item) {
    const wrapper = document.createElement("div");
    wrapper.className = "video-item";
    wrapper.dataset.id = item.id;
    wrapper.dataset.name = item.name;
    wrapper.dataset.width = "0";
    wrapper.dataset.height = "0";

    const selectCheckbox = document.createElement("input");
    selectCheckbox.type = "checkbox";
    selectCheckbox.className = "select-checkbox";
    selectCheckbox.title = "Select for comparison";

    selectCheckbox.addEventListener("change", () => {
        wrapper.classList.toggle("selected", selectCheckbox.checked);
        updateCompareButtonLabel();
        applyFilters();
    });

    const video = document.createElement("video");
    video.src = item.url;
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.playbackRate = state.speed;

    const scrubber = document.createElement("input");
    scrubber.type = "range";
    scrubber.className = "scrubber";
    scrubber.min = "0";
    scrubber.max = "100";
    scrubber.step = "0.01";
    scrubber.value = "0";

    const timeLabel = document.createElement("div");
    timeLabel.className = "time-label";
    timeLabel.textContent = "0:00 / 0:00";

    const nameEl = document.createElement("div");
    nameEl.className = "video-name";
    nameEl.title = item.name;
    nameEl.textContent = item.name;

    video.addEventListener("loadedmetadata", () => {
        wrapper.dataset.width = String(video.videoWidth || 320);
        wrapper.dataset.height = String(video.videoHeight || 180);
        applySizeToItem(wrapper, video);

        scrubber.max = String(video.duration || 0);
        timeLabel.textContent = formatTime(video.currentTime) + " / " + formatTime(video.duration);

        video.playbackRate = state.speed;
        video.play().catch(() => {});

        refreshDimensionOptions();
        applyFilters();
    });

    video.addEventListener("timeupdate", () => {
        if (!scrubber.dragging) {
            scrubber.value = String(video.currentTime);
        }
        timeLabel.textContent = formatTime(video.currentTime) + " / " + formatTime(video.duration);
    });

    scrubber.addEventListener("mousedown", () => {
        scrubber.dragging = true;
    });

    scrubber.addEventListener("mouseup", () => {
        scrubber.dragging = false;
    });

    scrubber.addEventListener("input", () => {
        video.currentTime = Number(scrubber.value);
    });

    wrapper.appendChild(selectCheckbox);
    wrapper.appendChild(video);
    wrapper.appendChild(scrubber);
    wrapper.appendChild(timeLabel);
    wrapper.appendChild(nameEl);

    return wrapper;
}

function addFiles(fileList) {
    const files = Array.from(fileList).filter(isVideoFile);

    files.forEach((file) => {
        const id = crypto.randomUUID();
        const url = URL.createObjectURL(file);
        const item = { id, file, url, name: extractName(file.name) };

        state.items.push(item);
        videoGrid.appendChild(buildItem(item));
    });

    if (files.length > 0) {
        updateToolbarVisibility();
        applySort(state.sort.key);
    }
}

function clearAll() {
    state.items.forEach((item) => URL.revokeObjectURL(item.url));
    state.items = [];
    videoGrid.innerHTML = "";
    state.sort = { key: "name" };
    state.filterSelected = false;
    state.dimensionFilter = "all";
    sortField.value = "name";
    refreshDimensionOptions();

    compareBtn.classList.remove("active");
    updateCompareButtonLabel();
    updateToolbarVisibility();
    saveControlsState();
}

function applySort(key) {
    state.sort = { key };

    const items = Array.from(videoGrid.children);

    items.sort((a, b) => {
        let av, bv;

        if (key === "name") {
            av = a.dataset.name.toLowerCase();
            bv = b.dataset.name.toLowerCase();
        } else {
            av = Number(a.dataset.width) * Number(a.dataset.height);
            bv = Number(b.dataset.width) * Number(b.dataset.height);
        }

        if (av < bv) return -1;
        if (av > bv) return 1;
        return 0;
    });

    items.forEach((item) => videoGrid.appendChild(item));
}

selectBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
    addFiles(e.target.files);
    fileInput.value = "";
});

clearBtn.addEventListener("click", clearAll);

["dragenter", "dragover"].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropzone.classList.add("drag-over");
    });
});

["dragleave", "drop"].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropzone.classList.remove("drag-over");
    });
});

dropzone.addEventListener("drop", (e) => {
    if (e.dataTransfer && e.dataTransfer.files) {
        addFiles(e.dataTransfer.files);
    }
});

sortField.addEventListener("change", () => {
    applySort(sortField.value);
    saveControlsState();
});

dimensionFilter.addEventListener("change", () => {
    state.dimensionFilter = dimensionFilter.value;
    applyFilters();
});

sizeSelect.addEventListener("change", () => {
    state.sizeScale = Number(sizeSelect.value);
    applySizeToAll();
    saveControlsState();
});

refreshBtn.addEventListener("click", () => {
    document.querySelectorAll("#videoGrid video").forEach((video) => {
        video.pause();
        video.currentTime = 0;
        video.playbackRate = state.speed;
        video.play().catch(() => {});
    });
});

labelsBtn.addEventListener("click", () => {
    state.labelsVisible = !state.labelsVisible;
    videoGrid.classList.toggle("hide-labels", !state.labelsVisible);
    labelsBtn.classList.toggle("active", state.labelsVisible);
    saveControlsState();
});

scrubberBtn.addEventListener("click", () => {
    state.scrubberVisible = !state.scrubberVisible;
    videoGrid.classList.toggle("hide-scrubber", !state.scrubberVisible);
    scrubberBtn.classList.toggle("active", state.scrubberVisible);
    saveControlsState();
});

compareBtn.addEventListener("click", () => {
    state.filterSelected = !state.filterSelected;
    compareBtn.classList.toggle("active", state.filterSelected);
    updateCompareButtonLabel();
    applyFilters();
    saveControlsState();
});

themeToggle.addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark");
});

document.querySelectorAll(".speed-button").forEach((button) => {
    button.addEventListener("click", () => {
        const speed = Number(button.dataset.speed);
        state.speed = speed;

        document.querySelectorAll(".speed-button").forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        document.querySelectorAll("#videoGrid video").forEach((video) => {
            video.pause();
            video.currentTime = 0;
            video.playbackRate = speed;
            video.play().catch(() => {});
        });

        saveControlsState();
    });
});

initTheme();
applyControlsState(loadControlsState());
