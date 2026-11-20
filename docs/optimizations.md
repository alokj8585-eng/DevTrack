# Optimization Notes

## Current implementation

- No frontend framework or build step is required.
- No external JavaScript dependencies are required.
- Data is stored as small JSON records in `localStorage`.
- The timer calculates elapsed time from timestamps rather than assuming every interval fires exactly on schedule.
- Rendering is separated into focused functions for tasks, sessions, journal and overview.
- User-provided text is HTML-escaped before insertion into generated markup.

## Future optimization opportunities

- Add pagination or virtualized lists if records become large.
- Debounce journal search for very large datasets.
- Move to Firestore for multi-device synchronization.
- Use indexed database queries instead of loading every record.
- Add automated performance and accessibility checks.
