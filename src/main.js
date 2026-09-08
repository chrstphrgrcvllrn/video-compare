import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./style.css";

const VIDEO_EXT = [".mp4", ".mov", ".webm", ".avi", ".ogg"];
const THEME_KEY = "video-preview-theme";
const CONTROLS_KEY = "video-preview-controls";
const NOTEPAD_CONTENT_KEY = "video-preview-notepad-content";
const NOTEPAD_OPEN_KEY = "video-preview-notepad-open";
const RELEASE_NOTES_SEEN_KEY = "video-preview-release-notes-seen";
const INFO_BANNER_COLLAPSED_KEY = "video-preview-info-banner-collapsed";

const ICON = {
    upload: '<path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />',
    trash: '<path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />',
    refresh:
        '<path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />',
    tag: '<path d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path d="M6 6h.008v.008H6V6z" />',
    sliders:
        '<path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />',
    sun: '<path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />',
    moon: '<path d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />',
    focus: '<path d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />',
    bell: '<path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />',
    speakerOn:
        '<path d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.483 0-.964-.078-1.423-.23l-.108-.036A1.125 1.125 0 012.25 15.06v-6.12a1.125 1.125 0 01.729-1.052l.108-.036c.46-.153.94-.231 1.423-.231H6.75z" />',
    speakerOff:
        '<path d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.483 0-.964-.078-1.423-.23l-.108-.036A1.125 1.125 0 012.25 15.06v-6.12a1.125 1.125 0 01.729-1.052l.108-.036c.46-.153.94-.231 1.423-.231H6.75z" />',
    singleFrame: '<rect x="5.25" y="5.25" width="13.5" height="13.5" rx="2.25" />',
    grid: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />',
    funnel: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />',
    chevronLeft: '<path d="M15.75 19.5L8.25 12l7.5-7.5" />',
    chevronRight: '<path d="M8.25 4.5l7.5 7.5-7.5 7.5" />',
    chevronDown: '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />',
    play: '<path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />',
    pause: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />',
    note: '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />',
};

function icon(name) {
    return (
        '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        ICON[name] +
        "</svg>"
    );
}

const RELEASE_NOTES = [
    {
        date: "September 8, 2026",
        items: [
            "Added focus mode to spotlight one or more videos for comparison, plus Unfocus All",
            "Added spacebar shortcut to play/pause all videos",
            "Added mute/unmute per video, plus a Mute All / Unmute All toggle",
            "Removed the select/compare checkbox in favor of focus mode",
            "Added a slider view to step through videos one at a time",
            "Added a Playing/Paused toast when using the spacebar shortcut",
            "Click any video to play/pause just that one, with an icon that fades after a second",
            "Added a Notepad panel with rich-text formatting to paste copy and compare it against the video preview",
            "Combined Sort by and Dimension into one Sort & Filter dropdown, with multi-select dimension checkboxes",
            "Added a red dot on the bell icon when there's a release you haven't seen yet",
            "Added a Per Row control to cap how many videos show per row",
            "Added a sliding transition when navigating between videos in Slider View",
        ],
    },
];

const state = {
    items: [],
    speed: 1,
    sort: { key: "name" },
    labelsVisible: true,
    scrubberVisible: true,
    dimensionFilters: new Set(),
    sizeScale: 0.25,
    perRow: "default",
    theme: "light",
    viewMode: "grid",
    sliderIndex: 0,
};

const app = document.getElementById("app");

app.innerHTML = `
    <div class="page">
        <div class="panel">
            <div id="infoBanner" class="info-banner">
                <div class="info-banner-text">
                    <p class="subtitle">Select local video files to preview, sort, and compare — nothing leaves your browser.</p>
                    <p class="hint">Press <kbd>Space</kbd> to play/pause all videos.</p>
                </div>
                <button id="infoBannerToggle" class="info-banner-toggle" type="button" title="Collapse" aria-label="Collapse banner">
                    ${icon("chevronDown")}
                </button>
            </div>

            <header class="panel-header">
                <div class="header-actions">
                    <button id="notepadToggle" class="icon-button" type="button" title="Notepad" aria-label="Toggle notepad">
                        ${icon("note")}
                    </button>
                    <div class="release-notes-wrap">
                        <button id="releaseNotesToggle" class="icon-button" type="button" title="Release notes" aria-label="Release notes">
                            ${icon("bell")}
                            <span id="releaseNotesDot" class="notification-dot" hidden></span>
                        </button>
                        <div id="releaseNotesPanel" class="release-notes-panel" hidden>
                            <div class="release-notes-header">
                                <span>What's new</span>
                                <button id="releaseNotesClose" class="release-notes-close" type="button" aria-label="Close">&times;</button>
                            </div>
                            ${RELEASE_NOTES.map(
                                (release) => `
                                <div class="release-notes-entry">
                                    <p class="release-notes-date">${release.date}</p>
                                    <ul>
                                        ${release.items.map((item) => `<li>${item}</li>`).join("")}
                                    </ul>
                                </div>
                            `,
                            ).join("")}
                        </div>
                    </div>
                    <button id="themeToggle" class="icon-button" type="button" title="Toggle theme" aria-label="Toggle theme">
                        <span class="icon-sun">${icon("sun")}</span>
                        <span class="icon-moon">${icon("moon")}</span>
                    </button>
                </div>
            </header>

            <div id="dropzone">
                <input id="fileInput" type="file" accept="video/*" multiple hidden />
                <button id="selectBtn" class="btn btn-primary" type="button">${icon("upload")}<span class="btn-label">Select Videos</span></button>
                <button id="clearBtn" class="btn btn-secondary" type="button" hidden>${icon("trash")}<span class="btn-label">Clear Selected</span></button>
                <span id="dropHint">or drag &amp; drop video files here</span>
            </div>

            <div id="controls" hidden>
                <div class="sort-filter-wrap">
                    <button id="sortFilterToggle" class="chip-button" type="button">
                        ${icon("funnel")}<span class="btn-label">Sort &amp; Filter</span>
                    </button>
                    <div id="sortFilterPanel" class="sort-filter-panel" hidden>
                        <div class="sort-filter-section">
                            <div class="sort-filter-section-title">Sort by</div>
                            <label class="sort-filter-option">
                                <input type="radio" name="sortRadio" value="name" checked />
                                <span>Name</span>
                            </label>
                            <label class="sort-filter-option">
                                <input type="radio" name="sortRadio" value="dimension" />
                                <span>Dimension</span>
                            </label>
                        </div>
                        <div class="sort-filter-section">
                            <div class="sort-filter-section-title">Dimension</div>
                            <div id="dimensionCheckboxList" class="sort-filter-checklist">
                                <p class="sort-filter-empty">No videos yet</p>
                            </div>
                        </div>
                    </div>
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
                <div class="sort-group">
                    <label for="perRowSelect">Per row</label>
                    <select id="perRowSelect">
                        <option value="default" selected>Default</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                </div>
                <button id="refreshBtn" class="chip-button" type="button">${icon("refresh")}<span class="btn-label">Refresh</span></button>
                <button id="muteToggleBtn" class="chip-button chip-button-icon" type="button" title="Mute All" aria-label="Mute All">${icon("speakerOff")}</button>
                <button id="unfocusAllBtn" class="chip-button chip-button-icon" type="button" title="Unfocus All" aria-label="Unfocus All">${icon("focus")}</button>
                <button id="labelsBtn" class="chip-button active" type="button">${icon("tag")}<span class="btn-label">Labels</span></button>
                <button id="scrubberBtn" class="chip-button active" type="button">${icon("sliders")}<span class="btn-label">Scrubber</span></button>
                <div id="viewModeSwitch" class="view-mode-switch">
                    <button id="sliderModeBtn" class="view-mode-option" type="button" title="Slider view" aria-label="Slider view">${icon("singleFrame")}</button>
                    <button id="gridModeBtn" class="view-mode-option active" type="button" title="Grid view" aria-label="Grid view">${icon("grid")}</button>
                </div>
                <div id="speedToggle">
                    <button class="speed-button active" data-speed="1" type="button">1x</button>
                    <button class="speed-button" data-speed="0.5" type="button">0.5x</button>
                    <button class="speed-button" data-speed="0.25" type="button">0.25x</button>
                </div>
            </div>

            <div id="videoStage">
                <button id="sliderPrevBtn" class="slider-arrow slider-arrow-prev" type="button" title="Previous video" aria-label="Previous video" hidden>${icon("chevronLeft")}</button>
                <div id="videoGrid"></div>
                <button id="sliderNextBtn" class="slider-arrow slider-arrow-next" type="button" title="Next video" aria-label="Next video" hidden>${icon("chevronRight")}</button>
            </div>
        </div>

        <aside id="notepadPanel" class="notepad-panel" hidden>
            <div class="notepad-header">
                <span class="notepad-title">Notepad</span>
                <div class="notepad-header-actions">
                    <button id="notepadClearBtn" class="notepad-icon-btn" type="button" title="Clear notes" aria-label="Clear notes">${icon("trash")}</button>
                    <button id="notepadCloseBtn" class="notepad-icon-btn" type="button" aria-label="Close notepad">&times;</button>
                </div>
            </div>
            <div id="notepadEditor" class="notepad-editor"></div>
        </aside>
    </div>

    <div id="playbackToast" class="toast" hidden>
        <span id="playbackToastIcon" class="toast-icon"></span>
        <span id="playbackToastText" class="toast-text"></span>
    </div>
`;

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const selectBtn = document.getElementById("selectBtn");
const clearBtn = document.getElementById("clearBtn");
const themeToggle = document.getElementById("themeToggle");
const releaseNotesToggle = document.getElementById("releaseNotesToggle");
const releaseNotesPanel = document.getElementById("releaseNotesPanel");
const releaseNotesDot = document.getElementById("releaseNotesDot");
const releaseNotesClose = document.getElementById("releaseNotesClose");
const controls = document.getElementById("controls");
const sortFilterToggle = document.getElementById("sortFilterToggle");
const sortFilterPanel = document.getElementById("sortFilterPanel");
const dimensionCheckboxList = document.getElementById("dimensionCheckboxList");
const sizeSelect = document.getElementById("sizeSelect");
const perRowSelect = document.getElementById("perRowSelect");
const refreshBtn = document.getElementById("refreshBtn");
const muteToggleBtn = document.getElementById("muteToggleBtn");
const unfocusAllBtn = document.getElementById("unfocusAllBtn");
const labelsBtn = document.getElementById("labelsBtn");
const scrubberBtn = document.getElementById("scrubberBtn");
const sliderModeBtn = document.getElementById("sliderModeBtn");
const gridModeBtn = document.getElementById("gridModeBtn");
const sliderPrevBtn = document.getElementById("sliderPrevBtn");
const sliderNextBtn = document.getElementById("sliderNextBtn");
const videoGrid = document.getElementById("videoGrid");
const videoStage = document.getElementById("videoStage");
const playbackToast = document.getElementById("playbackToast");
const playbackToastIcon = document.getElementById("playbackToastIcon");
const playbackToastText = document.getElementById("playbackToastText");
const infoBanner = document.getElementById("infoBanner");
const infoBannerToggle = document.getElementById("infoBannerToggle");
const notepadToggle = document.getElementById("notepadToggle");
const notepadPanel = document.getElementById("notepadPanel");
const notepadCloseBtn = document.getElementById("notepadCloseBtn");
const notepadClearBtn = document.getElementById("notepadClearBtn");

const notepadEditor = new Quill("#notepadEditor", {
    theme: "snow",
    placeholder: "Paste copy here to compare against the preview...",
    modules: {
        toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
        ],
    },
});

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
    clearBtn.hidden = state.items.length === 0;

    const showArrows = state.viewMode === "slider" && state.items.length > 0;
    sliderPrevBtn.hidden = !showArrows;
    sliderNextBtn.hidden = !showArrows;
}

function updateSortFilterToggleLabel() {
    const label = sortFilterToggle.querySelector(".btn-label");
    const count = state.dimensionFilters.size;
    label.textContent = "Sort & Filter" + (count > 0 ? " (" + count + ")" : "");
    sortFilterToggle.classList.toggle("active", count > 0);
}

function refreshDimensionOptions() {
    const dims = new Set();

    videoGrid.querySelectorAll(".video-item").forEach((el) => {
        if (el.dataset.width !== "0" && el.dataset.height !== "0") {
            dims.add(el.dataset.width + "×" + el.dataset.height);
        }
    });

    state.dimensionFilters.forEach((d) => {
        if (!dims.has(d)) state.dimensionFilters.delete(d);
    });

    const sortedDims = Array.from(dims).sort();

    dimensionCheckboxList.innerHTML = sortedDims.length
        ? sortedDims
              .map(
                  (d) =>
                      '<label class="sort-filter-option"><input type="checkbox" value="' +
                      d +
                      '"' +
                      (state.dimensionFilters.has(d) ? " checked" : "") +
                      " /><span>" +
                      d +
                      "</span></label>",
              )
              .join("")
        : '<p class="sort-filter-empty">No videos yet</p>';

    updateSortFilterToggleLabel();
}

function isPerRowGridActive() {
    return state.perRow !== "default" && state.viewMode !== "slider";
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
    applyPerRow();
}

function applyPerRow() {
    const active = isPerRowGridActive();
    videoGrid.classList.toggle("per-row-active", active);
    videoGrid.style.gridTemplateColumns = active ? "repeat(" + state.perRow + ", minmax(0, 1fr))" : "";
}

function matchesDimensionFilter(el) {
    if (state.dimensionFilters.size === 0) return true;
    const dimKey = el.dataset.width + "×" + el.dataset.height;
    return state.dimensionFilters.has(dimKey);
}

function applyFilters() {
    if (state.viewMode === "slider") {
        renderSlider();
        return;
    }

    videoGrid.querySelectorAll(".video-item").forEach((el) => {
        el.style.display = matchesDimensionFilter(el) ? "" : "none";
    });
}

function getSliderItems() {
    return Array.from(videoGrid.querySelectorAll(".video-item")).filter(matchesDimensionFilter);
}

const SLIDE_CLASSES = ["slide-anim", "slide-from-right", "slide-from-left", "slide-exit-left", "slide-exit-right"];

function resetSlideClasses(el) {
    el.classList.remove(...SLIDE_CLASSES);
}

function renderSlider() {
    const allItems = Array.from(videoGrid.querySelectorAll(".video-item"));
    allItems.forEach((el) => {
        el.style.display = "none";
        resetSlideClasses(el);
    });

    const items = getSliderItems();
    if (items.length === 0) return;

    if (state.sliderIndex >= items.length) state.sliderIndex = items.length - 1;
    if (state.sliderIndex < 0) state.sliderIndex = 0;

    const currentItem = items[state.sliderIndex];
    currentItem.style.display = "";
}

let slideCleanup = null;

function slideToIndex(step) {
    const items = getSliderItems();
    if (items.length === 0) return;

    const outgoing = items[state.sliderIndex] || null;
    const newIndex = ((state.sliderIndex + step) % items.length + items.length) % items.length;
    const incoming = items[newIndex];

    state.sliderIndex = newIndex;

    if (!outgoing || outgoing === incoming || items.length < 2) {
        renderSlider();
        return;
    }

    if (slideCleanup) slideCleanup();

    const direction = step > 0 ? "next" : "prev";

    outgoing.style.display = "";
    incoming.style.display = "";
    resetSlideClasses(outgoing);
    resetSlideClasses(incoming);
    outgoing.classList.add("slide-anim");
    incoming.classList.add("slide-anim");
    incoming.classList.add(direction === "next" ? "slide-from-right" : "slide-from-left");

    void incoming.offsetWidth;

    outgoing.classList.add(direction === "next" ? "slide-exit-left" : "slide-exit-right");
    incoming.classList.remove("slide-from-right", "slide-from-left");

    const cleanup = () => {
        Array.from(videoGrid.querySelectorAll(".video-item")).forEach((el) => {
            if (el !== incoming) el.style.display = "none";
            resetSlideClasses(el);
        });
        incoming.removeEventListener("transitionend", cleanup);
        clearTimeout(fallbackTimer);
        slideCleanup = null;
    };
    const fallbackTimer = setTimeout(cleanup, 400);
    incoming.addEventListener("transitionend", cleanup);
    slideCleanup = cleanup;
}

function updateSliderStageHeight() {
    if (state.viewMode !== "slider") {
        videoStage.style.height = "";
        return;
    }
    const topOffset = videoStage.getBoundingClientRect().top + window.scrollY;
    videoStage.style.height = Math.max(window.innerHeight - topOffset, 200) + "px";
}

function applyViewMode() {
    const isSlider = state.viewMode === "slider";
    videoGrid.classList.toggle("slider-view", isSlider);
    videoStage.classList.toggle("slider-mode", isSlider);
    sliderModeBtn.classList.toggle("active", isSlider);
    gridModeBtn.classList.toggle("active", !isSlider);
    updateToolbarVisibility();
    applyPerRow();
    applyFilters();
    updateSliderStageHeight();
}

function syncMuteToggleBtn() {
    const videos = Array.from(videoGrid.querySelectorAll("video"));
    const allMuted = videos.length === 0 || videos.every((video) => video.muted);
    muteToggleBtn.classList.toggle("active", allMuted);
    muteToggleBtn.innerHTML = icon(allMuted ? "speakerOn" : "speakerOff");
    muteToggleBtn.title = allMuted ? "Unmute All" : "Mute All";
    muteToggleBtn.setAttribute("aria-label", muteToggleBtn.title);
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
                sizeScale: state.sizeScale,
                viewMode: state.viewMode,
                perRow: state.perRow,
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
        setSortRadio(saved.sortKey);
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

    const validPerRow = ["default", "1", "2", "3", "4", "5", "6"];
    if (validPerRow.includes(saved.perRow)) {
        state.perRow = saved.perRow;
        perRowSelect.value = saved.perRow;
        applyPerRow();
    }

    if (saved.viewMode === "grid" || saved.viewMode === "slider") {
        state.viewMode = saved.viewMode;
        applyViewMode();
    }
}

function buildItem(item) {
    const wrapper = document.createElement("div");
    wrapper.className = "video-item";
    wrapper.dataset.id = item.id;
    wrapper.dataset.name = item.name;
    wrapper.dataset.width = "0";
    wrapper.dataset.height = "0";

    const focusBtn = document.createElement("button");
    focusBtn.type = "button";
    focusBtn.className = "focus-button";
    focusBtn.title = "Focus this video";
    focusBtn.setAttribute("aria-label", "Focus this video");
    focusBtn.innerHTML = icon("focus");

    focusBtn.addEventListener("click", () => {
        wrapper.classList.toggle("focused");
        const anyFocused = videoGrid.querySelector(".video-item.focused") !== null;
        videoGrid.classList.toggle("focus-mode", anyFocused);
    });

    const video = document.createElement("video");
    video.src = item.url;
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.playbackRate = state.speed;

    const muteBtn = document.createElement("button");
    muteBtn.type = "button";
    muteBtn.className = "mute-button";
    muteBtn.innerHTML = icon("speakerOff");

    function syncMuteButton() {
        muteBtn.innerHTML = icon(video.muted ? "speakerOff" : "speakerOn");
        muteBtn.title = video.muted ? "Unmute" : "Mute";
        muteBtn.setAttribute("aria-label", muteBtn.title);
        muteBtn.classList.toggle("is-unmuted", !video.muted);
        syncMuteToggleBtn();
    }

    video.addEventListener("volumechange", syncMuteButton);
    syncMuteButton();

    muteBtn.addEventListener("click", () => {
        video.muted = !video.muted;
    });

    const videoToolbar = document.createElement("div");
    videoToolbar.className = "video-toolbar";
    videoToolbar.appendChild(muteBtn);
    videoToolbar.appendChild(focusBtn);

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
        applyPerRow();

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

    const clickIndicator = document.createElement("div");
    clickIndicator.className = "video-click-indicator";
    clickIndicator.hidden = true;

    const clickIndicatorBadge = document.createElement("span");
    clickIndicatorBadge.className = "video-click-badge";
    clickIndicator.appendChild(clickIndicatorBadge);

    let clickIndicatorTimer = null;

    function showClickIndicator(isPlaying) {
        clickIndicatorBadge.innerHTML = icon(isPlaying ? "play" : "pause");
        clickIndicator.hidden = false;
        void clickIndicator.offsetWidth;
        clickIndicator.classList.add("visible");

        clearTimeout(clickIndicatorTimer);
        clickIndicatorTimer = setTimeout(() => {
            clickIndicator.classList.remove("visible");
            clickIndicatorTimer = setTimeout(() => {
                clickIndicator.hidden = true;
            }, 200);
        }, 1000);
    }

    video.addEventListener("click", () => {
        if (video.paused) {
            video.play().catch(() => {});
            showClickIndicator(true);
        } else {
            video.pause();
            showClickIndicator(false);
        }
    });

    const videoFrame = document.createElement("div");
    videoFrame.className = "video-frame";
    videoFrame.appendChild(video);
    videoFrame.appendChild(clickIndicator);

    wrapper.appendChild(videoFrame);
    wrapper.appendChild(videoToolbar);
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

function setSortRadio(key) {
    const radio = sortFilterPanel.querySelector('input[name="sortRadio"][value="' + key + '"]');
    if (radio) radio.checked = true;
}

function clearAll() {
    state.items.forEach((item) => URL.revokeObjectURL(item.url));
    state.items = [];
    videoGrid.innerHTML = "";
    videoGrid.classList.remove("focus-mode");
    state.sort = { key: "name" };
    state.dimensionFilters.clear();
    state.sliderIndex = 0;
    setSortRadio("name");
    refreshDimensionOptions();

    updateToolbarVisibility();
    syncMuteToggleBtn();
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

sortFilterToggle.addEventListener("click", () => {
    sortFilterPanel.hidden = !sortFilterPanel.hidden;
});

document.addEventListener("click", (e) => {
    if (sortFilterPanel.hidden) return;
    if (e.target === sortFilterToggle || sortFilterToggle.contains(e.target)) return;
    if (sortFilterPanel.contains(e.target)) return;
    sortFilterPanel.hidden = true;
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !sortFilterPanel.hidden) {
        sortFilterPanel.hidden = true;
    }
});

sortFilterPanel.querySelectorAll('input[name="sortRadio"]').forEach((radio) => {
    radio.addEventListener("change", () => {
        if (!radio.checked) return;
        applySort(radio.value);
        saveControlsState();
    });
});

dimensionCheckboxList.addEventListener("change", (e) => {
    if (e.target.type !== "checkbox") return;
    if (e.target.checked) {
        state.dimensionFilters.add(e.target.value);
    } else {
        state.dimensionFilters.delete(e.target.value);
    }
    updateSortFilterToggleLabel();
    applyFilters();
});

sizeSelect.addEventListener("change", () => {
    state.sizeScale = Number(sizeSelect.value);
    applySizeToAll();
    saveControlsState();
});

perRowSelect.addEventListener("change", () => {
    state.perRow = perRowSelect.value;
    applyPerRow();
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

muteToggleBtn.addEventListener("click", () => {
    const videos = Array.from(videoGrid.querySelectorAll("video"));
    const allMuted = videos.length > 0 && videos.every((video) => video.muted);
    videos.forEach((video) => {
        video.muted = !allMuted;
    });
});

unfocusAllBtn.addEventListener("click", () => {
    videoGrid
        .querySelectorAll(".video-item.focused")
        .forEach((el) => el.classList.remove("focused"));
    videoGrid.classList.remove("focus-mode");
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

sliderModeBtn.addEventListener("click", () => {
    if (state.viewMode === "slider") return;
    state.viewMode = "slider";
    state.sliderIndex = 0;
    applyViewMode();
    saveControlsState();
});

gridModeBtn.addEventListener("click", () => {
    if (state.viewMode === "grid") return;
    state.viewMode = "grid";
    applyViewMode();
    saveControlsState();
});

sliderPrevBtn.addEventListener("click", () => {
    slideToIndex(-1);
});

sliderNextBtn.addEventListener("click", () => {
    slideToIndex(1);
});

themeToggle.addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark");
});

function updateReleaseNotesDot() {
    const latest = RELEASE_NOTES[0] && RELEASE_NOTES[0].date;
    let seen = null;
    try {
        seen = localStorage.getItem(RELEASE_NOTES_SEEN_KEY);
    } catch {
        /* localStorage unavailable */
    }
    releaseNotesDot.hidden = !latest || seen === latest;
}

function markReleaseNotesSeen() {
    const latest = RELEASE_NOTES[0] && RELEASE_NOTES[0].date;
    if (!latest) return;
    try {
        localStorage.setItem(RELEASE_NOTES_SEEN_KEY, latest);
    } catch {
        /* localStorage unavailable */
    }
    releaseNotesDot.hidden = true;
}

function setInfoBannerCollapsed(collapsed) {
    infoBanner.classList.toggle("collapsed", collapsed);
    infoBannerToggle.title = collapsed ? "Expand" : "Collapse";
    infoBannerToggle.setAttribute("aria-label", collapsed ? "Expand banner" : "Collapse banner");
    try {
        localStorage.setItem(INFO_BANNER_COLLAPSED_KEY, collapsed ? "1" : "0");
    } catch {
        /* localStorage unavailable */
    }
}

function initInfoBanner() {
    let collapsed = false;
    try {
        collapsed = localStorage.getItem(INFO_BANNER_COLLAPSED_KEY) === "1";
    } catch {
        /* localStorage unavailable */
    }
    setInfoBannerCollapsed(collapsed);
}

infoBannerToggle.addEventListener("click", () => {
    setInfoBannerCollapsed(!infoBanner.classList.contains("collapsed"));
});

releaseNotesToggle.addEventListener("click", () => {
    releaseNotesPanel.hidden = !releaseNotesPanel.hidden;
    if (!releaseNotesPanel.hidden) {
        markReleaseNotesSeen();
    }
});

releaseNotesClose.addEventListener("click", () => {
    releaseNotesPanel.hidden = true;
});

document.addEventListener("click", (e) => {
    if (releaseNotesPanel.hidden) return;
    if (e.target === releaseNotesToggle || releaseNotesToggle.contains(e.target)) return;
    if (releaseNotesPanel.contains(e.target)) return;
    releaseNotesPanel.hidden = true;
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !releaseNotesPanel.hidden) {
        releaseNotesPanel.hidden = true;
    }
});

let notepadCloseTimer = null;

function setNotepadOpen(open) {
    clearTimeout(notepadCloseTimer);
    notepadToggle.classList.toggle("active", open);

    if (open) {
        notepadPanel.hidden = false;
        // Force reflow so the transition runs from the closed state.
        void notepadPanel.offsetWidth;
        notepadPanel.classList.add("open");
    } else {
        notepadPanel.classList.remove("open");
        notepadCloseTimer = setTimeout(() => {
            notepadPanel.hidden = true;
        }, 220);
    }

    try {
        localStorage.setItem(NOTEPAD_OPEN_KEY, open ? "1" : "0");
    } catch {
        /* localStorage unavailable */
    }
}

function saveNotepadContent() {
    try {
        localStorage.setItem(NOTEPAD_CONTENT_KEY, JSON.stringify(notepadEditor.getContents()));
    } catch {
        /* localStorage unavailable */
    }
}

notepadToggle.addEventListener("click", () => {
    setNotepadOpen(notepadPanel.hidden);
});

notepadCloseBtn.addEventListener("click", () => setNotepadOpen(false));

notepadClearBtn.addEventListener("click", () => {
    notepadEditor.setText("");
    saveNotepadContent();
    notepadEditor.focus();
});

notepadEditor.on("text-change", (delta, oldDelta, source) => {
    if (source !== "user") return;
    saveNotepadContent();
});

function initNotepad() {
    try {
        const savedContent = localStorage.getItem(NOTEPAD_CONTENT_KEY);
        if (savedContent) {
            notepadEditor.setContents(JSON.parse(savedContent));
        } else {
            const legacyText = localStorage.getItem("video-preview-notepad-text");
            if (legacyText) {
                notepadEditor.setText(legacyText);
                saveNotepadContent();
            }
        }

        if (localStorage.getItem(NOTEPAD_OPEN_KEY) === "1") {
            setNotepadOpen(true);
        }
    } catch {
        /* localStorage unavailable */
    }
}

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

let playbackToastTimer = null;

function showPlaybackToast(isPlaying) {
    playbackToastIcon.innerHTML = icon(isPlaying ? "play" : "pause");
    playbackToastText.textContent = isPlaying ? "Playing" : "Paused";
    playbackToast.hidden = false;
    // Force reflow so the transition re-triggers on rapid toggles.
    void playbackToast.offsetWidth;
    playbackToast.classList.add("visible");

    clearTimeout(playbackToastTimer);
    playbackToastTimer = setTimeout(() => {
        playbackToast.classList.remove("visible");
        playbackToastTimer = setTimeout(() => {
            playbackToast.hidden = true;
        }, 200);
    }, 1000);
}

function toggleAllPlayback() {
    const scope = videoGrid.classList.contains("focus-mode")
        ? ".video-item.focused video"
        : "video";
    const videos = Array.from(videoGrid.querySelectorAll(scope));
    if (videos.length === 0) return;

    const anyPlaying = videos.some((video) => !video.paused);
    videos.forEach((video) => {
        if (anyPlaying) {
            video.pause();
        } else {
            video.play().catch(() => {});
        }
    });

    showPlaybackToast(!anyPlaying);
}

document.addEventListener("keydown", (e) => {
    if (e.code !== "Space") return;

    const tag = e.target.tagName;
    if (
        tag === "INPUT" ||
        tag === "SELECT" ||
        tag === "TEXTAREA" ||
        tag === "BUTTON" ||
        e.target.isContentEditable
    ) {
        return;
    }

    e.preventDefault();
    toggleAllPlayback();
});

window.addEventListener("resize", () => {
    updateSliderStageHeight();
    applyPerRow();
});

initTheme();
applyControlsState(loadControlsState());
syncMuteToggleBtn();
initNotepad();
updateReleaseNotesDot();
initInfoBanner();
