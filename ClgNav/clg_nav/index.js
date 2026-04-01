const campusEntrance = "12.869944,80.218403";

const state = {
    events: [],
    places: [],
    messMenu: [],
    filteredDestinations: []
};

const destinationSelect = document.getElementById("destination");
const searchTypeSelect = document.getElementById("searchType");
const destinationFilter = document.getElementById("destinationFilter");
const destinationSearch = document.getElementById("destinationSearch");
const statusMsg = document.getElementById("status-msg");
const eventsGrid = document.getElementById("eventsGrid");
const eventsEmpty = document.getElementById("eventsEmpty");
const eventTypeFilter = document.getElementById("eventTypeFilter");
const eventSearch = document.getElementById("eventSearch");
const messTabs = document.getElementById("messTabs");
const messPanels = document.getElementById("messPanels");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

function getMapsUrl(origin, destination) {
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
}

function createOption(value, label) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
}

function populateSelect(selectEl, values, defaultLabel) {
    selectEl.innerHTML = "";
    selectEl.appendChild(createOption("all", defaultLabel));
    values.forEach((value) => {
        selectEl.appendChild(createOption(value, value));
    });
}

function getDestinationData() {
    return searchTypeSelect.value === "event" ? state.events : state.places;
}

function buildDestinationFilters() {
    const key = searchTypeSelect.value === "event" ? "type" : "category";
    const values = [...new Set(getDestinationData().map((item) => item[key]).filter(Boolean))].sort();
    const label = searchTypeSelect.value === "event" ? "All Event Types" : "All Place Categories";
    populateSelect(destinationFilter, values, label);
}

function updateDestinationOptions() {
    const type = searchTypeSelect.value;
    const filterValue = destinationFilter.value;
    const searchTerm = destinationSearch.value.trim().toLowerCase();
    const currentData = getDestinationData();
    const filterKey = type === "event" ? "type" : "category";

    const filtered = currentData.filter((item) => {
        const matchesFilter = filterValue === "all" || item[filterKey] === filterValue;
        const searchTarget = `${item.name} ${item.location || ""} ${item.category || ""}`.toLowerCase();
        const matchesSearch = !searchTerm || searchTarget.includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    state.filteredDestinations = filtered;
    destinationSelect.innerHTML = "";

    if (!filtered.length) {
        destinationSelect.appendChild(createOption("", "No matching destinations"));
        return;
    }

    filtered.forEach((item) => {
        const coords = `${item.latitude},${item.longitude}`;
        destinationSelect.appendChild(createOption(coords, item.name));
    });
}

function refreshDestinationControls() {
    buildDestinationFilters();
    updateDestinationOptions();
}

function navigateFixed() {
    const dest = destinationSelect.value;
    if (!dest) {
        statusMsg.textContent = "No destination is available for the current search.";
        return;
    }
    statusMsg.textContent = "";
    window.open(getMapsUrl(campusEntrance, dest), "_blank", "noopener");
}

function navigateFromMyLocation() {
    if (!navigator.geolocation) {
        statusMsg.textContent = "Geolocation is not supported on this device.";
        return;
    }

    const dest = destinationSelect.value;
    if (!dest) {
        statusMsg.textContent = "No destination is available for the current search.";
        return;
    }

    statusMsg.textContent = "Getting your current location...";
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
            statusMsg.textContent = "";
            window.open(getMapsUrl(origin, dest), "_blank", "noopener");
        },
        () => {
            statusMsg.textContent = "Location access was denied. Using the main entrance instead.";
            navigateFixed();
        }
    );
}

function goToEvent(lat, lng) {
    window.open(getMapsUrl(campusEntrance, `${lat},${lng}`), "_blank", "noopener");
}

function renderEvents() {
    const typeValue = eventTypeFilter.value;
    const searchTerm = eventSearch.value.trim().toLowerCase();

    const filteredEvents = state.events.filter((event) => {
        const matchesType = typeValue === "all" || event.type === typeValue;
        const searchTarget = `${event.name} ${event.location} ${event.description}`.toLowerCase();
        const matchesSearch = !searchTerm || searchTarget.includes(searchTerm);
        return matchesType && matchesSearch;
    });

    eventsGrid.innerHTML = "";

    if (!filteredEvents.length) {
        eventsEmpty.classList.remove("hidden");
        return;
    }

    eventsEmpty.classList.add("hidden");

    filteredEvents.forEach((event) => {
        const card = document.createElement("article");
        card.className = "event-card";
        card.innerHTML = `
            <div class="event-type">${event.type}</div>
            <h3>${event.name}</h3>
            <div class="event-desc">${event.description}</div>
            <div class="event-meta">${event.date}</div>
            <div class="event-loc">${event.location}</div>
            <button class="dir-btn" type="button" data-lat="${event.latitude}" data-lng="${event.longitude}">
                Get Directions
            </button>
        `;
        eventsGrid.appendChild(card);
    });

    eventsGrid.querySelectorAll(".dir-btn").forEach((button) => {
        button.addEventListener("click", () => {
            goToEvent(button.dataset.lat, button.dataset.lng);
        });
    });
}

function renderMessMenu() {
    messTabs.innerHTML = "";
    messPanels.innerHTML = "";

    state.messMenu.forEach((day, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `mess-tab${index === 0 ? " active" : ""}`;
        button.textContent = day.day;
        button.dataset.day = day.id;
        button.addEventListener("click", () => switchDay(day.id, button));
        messTabs.appendChild(button);

        const panel = document.createElement("div");
        panel.id = day.id;
        panel.className = `mess-content${index === 0 ? " active" : ""}`;
        panel.innerHTML = `
            <div class="mess-food-list">
                ${day.items.map((item) => `<div class="mess-food-chip">${item}</div>`).join("")}
            </div>
        `;
        messPanels.appendChild(panel);
    });
}

function switchDay(id, btn) {
    document.querySelectorAll(".mess-content").forEach((content) => content.classList.remove("active"));
    document.querySelectorAll(".mess-tab").forEach((tab) => tab.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    btn.classList.add("active");
}

async function loadJson(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`Failed to load ${path}: HTTP ${response.status}`);
    }
    return response.json();
}

async function loadAppData() {
    try {
        const [events, places, messMenu] = await Promise.all([
            loadJson("events.json"),
            loadJson("places.json"),
            loadJson("mess.json")
        ]);

        state.events = events;
        state.places = places;
        state.messMenu = messMenu;

        populateSelect(
            eventTypeFilter,
            [...new Set(state.events.map((event) => event.type).filter(Boolean))].sort(),
            "All Event Types"
        );
        refreshDestinationControls();
        renderEvents();
        renderMessMenu();
    } catch (error) {
        console.error("Failed to load app data:", error);
        statusMsg.textContent = "Could not load project data. Run the site through a local server.";
        eventsEmpty.textContent = "Could not load events right now.";
        eventsEmpty.classList.remove("hidden");
    }
}

function goToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    document.querySelectorAll(".nav-links a[id]").forEach((a) => a.classList.remove("active"));
    document.getElementById(`nl-${id}`).classList.add("active");
    closeMenu();
}

function toggleDark() {
    document.body.classList.toggle("dark");
    document.getElementById("darkBtn").textContent = document.body.classList.contains("dark") ? "Light" : "Dark";
}

function closeMenu() {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});

window.addEventListener("scroll", () => {
    const ids = ["navigate", "events", "mess"];
    const scrollBottom = window.scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    let current = "navigate";

    if (scrollBottom >= docHeight - 10) {
        current = "mess";
    } else {
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el && window.scrollY >= el.offsetTop - 140) {
                current = id;
            }
        });
    }

    document.querySelectorAll(".nav-links a[id]").forEach((a) => a.classList.remove("active"));
    const activeLink = document.getElementById(`nl-${current}`);
    if (activeLink) {
        activeLink.classList.add("active");
    }
});

searchTypeSelect.addEventListener("change", () => {
    destinationSearch.value = "";
    statusMsg.textContent = "";
    refreshDestinationControls();
});

destinationFilter.addEventListener("change", updateDestinationOptions);
destinationSearch.addEventListener("input", updateDestinationOptions);
eventTypeFilter.addEventListener("change", renderEvents);
eventSearch.addEventListener("input", renderEvents);

loadAppData();
