# DevTrack

**Your development journey, organized.**

DevTrack is a lightweight developer productivity tracker. It helps you manage programming tasks, record focused coding sessions, and keep a journal of what you learn.

## Features

- Overview dashboard with today's tracked time, task counts, journal count and a 7-day activity chart.
- Task manager: add, edit, complete, filter and delete tasks.
- Coding timer: start, pause, resume and finish sessions.
- Timer state is restored after a page refresh.
- Learning journal: create, edit, search and delete entries.
- Responsive minimal interface.
- Data is stored in the browser using `localStorage`.

## Run locally

No installation or build tools are required.

1. Download or clone this repository.
2. Open `index.html` in a modern browser.

For a local development server, you can use the VS Code Live Server extension, or run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Browser localStorage

## Data and privacy

This starter version stores data locally in the browser where it is used. It does **not** include Firebase, cloud sync, user accounts, or multi-device access. Clearing browser site data may remove your DevTrack records. Export and backup are not currently implemented.

## Project structure

```text
DevTrack/
├── index.html
├── styles.css
├── app.js
├── README.md
└── docs/
    ├── approach.md
    ├── challenges.md
    ├── optimizations.md
    └── TESTING.md
```

## Suggested future improvements

- Firebase Authentication and Firestore sync.
- User-selectable daily coding goal.
- CSV/JSON export and import.
- More analytics and date filters.
- Automated browser tests.
- Accessibility improvements.

## License

Choose a license before publishing this project publicly (for example, MIT).
