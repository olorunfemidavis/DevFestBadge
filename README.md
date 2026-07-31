# DevFest 2026 Badge Creator

**Read this in other languages:**  
[English](README.md) | [Español](docs/locales/README.es.md) | [Français](docs/locales/README.fr.md) | [Português](docs/locales/README.pt.md) | [Èdè Yorùbá](docs/locales/README.yo.md) | [Deutsch](docs/locales/README.de.md) | [Türkçe](docs/locales/README.tr.md) | [العربية](docs/locales/README.ar.md) | [हिन्दी](docs/locales/README.hi.md) | [日本語](docs/locales/README.ja.md) | [Kiswahili](docs/locales/README.sw.md)

DevFest Badge Creator turns attendee data into ready-to-print DevFest badges. It supports CSV, XLSX, and JSON files, previews the first valid badge, and downloads the generated badges as a ZIP.

Live app: https://devfestbadge.web.app

<img src="public/images/icon/badge_logo.png" width="400" alt="DevFest Badge Creator logo">

## What It Does

1. Upload attendee data in CSV, XLSX, or JSON format.
2. Review the first generated badge preview.
3. Download all valid badges as a ZIP.

The app is intentionally static and lightweight. Badge rendering happens in the browser with Canvas, so no attendee file is sent to a backend for normal badge generation.

## Data Format

Sample files are available in `public/files`:

- `sample.csv`
- `sample.xlsx`
- `sample.json`

Recommended fields:

| Field | Required | Notes |
| --- | --- | --- |
| `location` | Yes | GDG chapter, city, or event location displayed near the top of the badge. |
| `firstname` | Yes | First name shown on the badge. |
| `lastname` | Yes | Last name shown on the badge. |
| `title` | No | Role, title, or short descriptor. |
| `organization` | No | Organization, company, or community. |
| `participationType` | No | `Attendee`, `Speaker`, `General`, or `Staff`. Defaults to `General` when blank or unknown. |

The parser also accepts common header variants such as `firstName`, `first_name`, `surname`, `company`, `chapter`, `city`, `type`, and `badgeType`.

Rows missing `location`, `firstname`, or `lastname` are skipped and reported in the page validation summary. Unknown participation types are treated as warnings and rendered with the general badge template.

## Rendering

Badge layout is controlled by `public/files/badgeConfig.json`. Each field defines:

- `x`, `y`, `w`, `h`
- `fontsize`
- `fontfamily`
- `align`

The renderer uses the 2026 badge templates in `public/images/badge`, caches template images, waits for fonts, and reduces text size when a field is too long for its configured width.

## Usage Tracking

The old Jason Cameron counter has been replaced with Firebase Realtime Database usage counters, matching the DevFest Avatar approach.

Writes are disabled on localhost and development hosts by default. Production tracking runs only on:

- `devfestbadge.web.app`
- `devfestbadge.firebaseapp.com`

For testing, use query-string overrides:

- `?usageTracking=on`
- `?usageTracking=off`

Current counters are year-prefixed under `usage/badges`, including site visits, file uploads, uploaded rows, generated badge totals, and batches.

## Local Development

Serve the static app from the project root:

```powershell
http-server ./public -p 8082
```

Then open:

```text
http://127.0.0.1:8082
```

## Verification Notes

The 2026 refresh was checked with browser automation against the local server for:

- page load and empty badge preview rendering,
- sample CSV upload and ZIP download,
- malformed CSV handling with skipped rows and warnings,
- 1000-row CSV parsing and mobile responsiveness,
- light and dark theme screenshots.

Large exports can produce large ZIP files because each badge is a print-resolution PNG. The generator processes badges sequentially and updates progress so the interface remains responsive, but very large batches still depend on browser memory and device capability.

## Contributors

### 2025

- [Ewuji John](https://github.com/JbravoI)
- David Oluwabusayo, GDG Ado-Ekiti Lead
- [Reality Stevens](https://github.com/realitystevens)

## License

Open source under the MIT License.

