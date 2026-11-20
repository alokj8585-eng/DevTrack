# Testing Checklist

Run the application in a modern browser and verify these cases. Record the actual result and date when you perform the checks.

| Area | Test | Expected result |
|---|---|---|
| Navigation | Open each sidebar item | Correct page appears |
| Tasks | Submit an empty task title | Task is not saved |
| Tasks | Add a valid task | Task appears in the list |
| Tasks | Edit a task | Updated values appear |
| Tasks | Mark task complete | Status changes to Completed |
| Tasks | Filter by status | Only matching tasks appear |
| Tasks | Delete a task | Confirmation appears and task is removed |
| Timer | Start without project name | Validation message appears |
| Timer | Start a session | Timer begins |
| Timer | Pause and resume | Paused time is not counted |
| Timer | Refresh while running | Timer is restored |
| Timer | Finish session | Session appears in history |
| Journal | Save title and notes | Entry appears |
| Journal | Search journal | Matching entries appear |
| Journal | Edit and delete entry | Changes are reflected |
| Persistence | Refresh browser | Saved records remain |

## Test result recording

Do not mark a test as passed until you have run it. Add the browser, date, and observed result when documenting a test run.

## Known limitations

- No automated test suite is included in this beginner version.
- There is no cloud backup or cross-device synchronization.
- There is no account authentication.
- The daily goal is currently fixed at 120 minutes.
