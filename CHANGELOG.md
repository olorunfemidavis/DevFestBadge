# Changelog

All notable changes to DevFest Badge Creator are documented here.

## [Unreleased]

- Hidden Preview panel section on mobile view (`max-width: 900px`).
- Compacted top brand header and reduced preview canvas frame width (`280px`) so the default landing page fits above the fold on desktop screens.
- Updated public sample files (`sample.csv`, `sample.json`, `sample.xlsx`)
- Hidden Export heading and Download ZIP controls until a valid attendee file is uploaded, while keeping the community count stat line visible at all times.
- Configured official Firebase Realtime Database SDK configuration (`devfestbadge`) in `index.html`.
- Deferred `fileUploads` and `uploadedRows` counter increments so they register only when a badge download is initiated.
- Added session tracking flags to prevent duplicate `fileUploads` counter increments when re-downloading the same uploaded file.
- Added comprehensive numeric input sanitization and transaction safeguards (`sanitizePositiveInt`, `safeIncrement`) to prevent invalid, negative, or corrupted counter data in Firebase Realtime Database.
- Refreshed the app shell for DevFest 2026 with print-inspired panels, badge-first preview, and direct sample-file links.
- Split CSS into token, base, layout, component, and responsive files.
- Split JavaScript into Firebase usage tracking, file parsing, badge rendering, and page orchestration modules.
- Replaced the Jason Cameron counter with Firebase Realtime Database usage counters, using production-only writes and local query-string overrides.
- Added robust CSV, JSON, and XLSX parsing flow with row validation, header aliases, skipped-row reporting, and participation-type warnings.
- Improved badge rendering with cached template images, explicit font readiness, explicit Regular/400 badge text weights, filename sanitization, and text-size fitting for long values.
- Improved ZIP generation by creating badge blobs sequentially, updating progress during large batches, and avoiding base64 data URLs.
- Updated the UI metadata, labels, and download filename for DevFest 2026.
- Added responsive light and dark theme styling, including mobile layout checks.
- Updated footer credit to match the DevFest Avatar collaboration language.
- Removed unused legacy CSS and open-source image assets after the footer and CSS split.
- Randomized public sample data and local 1000-row test input with realistic attendee details and active GDG chapters.
- Documented large-list behavior, data requirements, usage tracking.

## [2026.0.0] - 2026-07-31

- Updated badge templates and badge logo assets for DevFest 2026.

## [2025]

- Created the browser-based badge generator with CSV, XLSX, and JSON input support.
- Rendered badges with Canvas and template-specific badge artwork.
- Added ZIP download support for generated badges.



