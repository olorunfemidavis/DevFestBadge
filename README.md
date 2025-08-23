# DevFest 2025 Badge Generator

Easily generate ready-to-print event badges for DevFest 2025!

## Features

- **Upload attendee data**: Supports CSV, XLSX, and JSON formats. See sample files in the `public/files` folder for the required structure.
- **Automatic badge rendering**: Each attendee's data is overlaid on a badge template using accurate fonts, positioning, and justification.
- **Participation types**: Badge image changes based on `participationType` (Attendee, Speaker, General, Staff).
- **Preview**: Instantly preview the first badge after upload.
- **Download all badges**: Generate and download a ZIP containing unique badge images for all attendees.
- **Responsive, theme-aware UI**: Works beautifully on desktop and mobile, adapts to light/dark mode.

## How It Works

1. Prepare your attendee data in CSV, XLSX, or JSON format. Use the sample files for reference.
2. Upload your file using the web interface.
3. Preview the first badge and download all badges as a ZIP.
4. Print and distribute your badges!

## Technologies Used
- HTML5, CSS3
- JavaScript (Canvas, FileReader, JSZip)
- Google Fonts (Google Sans, Google Sans Mono)
- PapaParse (CSV parsing)
- SheetJS (XLSX parsing)

## Badge Layout Configuration
- Badge layout (positions, font sizes, alignment) is controlled via `public/files/badgeConfig.json`.
- You can manually adjust this file for perfect results.

## Contributing
Pull requests and suggestions are welcome! See the [GitHub repo](https://github.com/olorunfemidavis/DevFestBadge).

## License
Open source under the MIT License.

---
With ❤ by [GDG Ado-Ekiti](https://gdg.community.dev/gdg-ado-ekiti) 🇳🇬
