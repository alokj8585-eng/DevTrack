# Challenges and Considerations

This document records design considerations for the starter implementation. Replace or extend these notes with challenges actually encountered during development.

## 1. Keeping the timer accurate

A timer based only on incrementing a counter can drift or reset after a page refresh. DevTrack stores timestamps and accumulated milliseconds. The displayed time is calculated from those values.

## 2. Preserving data after refresh

The app serializes tasks, sessions, journal entries and timer state into browser `localStorage`. On startup, it reads those values back.

## 3. Preventing unsafe HTML rendering

User-entered titles and journal content are escaped before being inserted into HTML templates to reduce the risk of HTML/script injection.

## 4. Browser-local storage limitations

`localStorage` is convenient for a beginner project, but it is not a secure cloud database. Data is not synchronized between devices and can be removed by clearing browser data.

## 5. Future work

A production cloud version should add authentication, Firestore security rules, data export, automated tests and server-backed persistence.
