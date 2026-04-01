# CampusNav for SJCE

A responsive campus navigation web app built for St. Joseph's College of Engineering, Chennai.

The project helps students, parents, visitors, and event participants explore the campus, find important locations, view events, check the mess menu, and open directions directly in Google Maps.

## Current Status

This is a front-end project built with HTML, CSS, and JavaScript.

The app currently includes:

- Campus navigation with Google Maps routing
- Search and filter options
- Dynamic data from JSON
- Responsive layout for desktop, tablet, and mobile
- Dark mode
- Feedback form prepared for real submission with Formspree

## Tech Stack

- HTML
- CSS
- JavaScript
- JSON for app data
- Google Maps direction links
- Formspree for feedback submission

## Project Structure

```text
clg_nav/
|-- index.html
|-- index.css
|-- index.js
|-- sample.html
|-- sample.css
|-- sample.js
|-- events.json
|-- places.json
|-- mess.json
|-- images/
|   |-- clg_logo.png
|   `-- homepage.jpg
`-- README.md
```

## Main Features

### 1. Campus Navigation

Users can:

- choose between place search and event search
- filter destinations by category
- search destinations by name
- open directions from the main entrance
- use current location for navigation

### 2. Event Section

The events section is fully data-driven.

All event cards are loaded from `events.json`, so updating events does not require changing the HTML.

Users can:

- search events by name or venue
- filter events by event type
- open directions to event venues

### 3. Mess Menu

The weekly mess menu is loaded from `mess.json`.

This makes it easy to update food items or days without editing the main page structure.

### 4. Feedback Form

The feedback page is available in `sample.html`.

It is set up for Formspree-based submission. To activate live submissions, replace the placeholder Formspree endpoint in `sample.html` with your real endpoint.

### 5. Responsive Design

The project is designed to work across different screen sizes with:

- mobile navigation menu
- responsive event grid
- flexible search and filter controls
- mobile-friendly feedback form

## Data Files

### `events.json`

Stores all event details such as:

- event name
- type
- date
- description
- location
- latitude
- longitude

### `places.json`

Stores campus destinations such as:

- departments
- hostels
- food areas
- sports areas
- landmarks
- facilities

Each place includes category, location name, and map coordinates.

### `mess.json`

Stores the weekly mess menu day-wise.

Each day includes:

- id
- day name
- menu items

## How to Run

Since the project uses `fetch()` to load JSON files, do not run it by opening `index.html` directly with `file://`.

Use a local server instead.

### Option 1. Python

```bash
python -m http.server
```

Then open:

```text
http://localhost:8000/clg_nav/
```

### Option 2. VS Code Live Server

Open the project in VS Code and run it with the Live Server extension.

### Note
This project was developed as a team-based project for an internal hackathon in our college called Makeathon 2.0 and I'm proud to say that we are awarded with Rs.3000 as a runner-up.❤️‍🔥 This was my first ever project as a team and also using different technologies. I also mention that I have added different functionalities in this project further.🤗
