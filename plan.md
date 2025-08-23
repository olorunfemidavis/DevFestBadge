# DevFest 2025 Badge Generator - Implementation Plan

## Features

1. **File Upload & Parsing**
   - Accept CSV, XLSX, or JSON files containing attendee data.
   - Parse files and map to badge fields: location, firstname, lastname, title, organization, participationType.

2. **Badge Rendering**
   - Use HTML5 Canvas to overlay attendee data on badge templates (images/badge/{type}.png).
   - Apply Google Sans and Google Sans Mono fonts as specified.
   - Dynamically adjust font size to fit within configured bounds.
   - Support text justification (left, center, right).

3. **Configuration Controls**
   - UI for manually setting X, Y, width, height, font size, and justification for each text field.
   - Save and apply configuration to all badge renders.

4. **Preview & Download**
   - Show preview of the first badge after upload.
   - Generate badges for all attendees and package as ZIP for download.

5. **Theme Efficiency**
   - Detect system theme (light/dark) and adapt UI and badge rendering accordingly.

## Implementation Steps

1. Scaffold UI and basic JS logic (done)
2. Implement file parsing for CSV, XLSX, JSON
3. Render badge preview with correct image and fonts
4. Add configuration modal for layout controls
5. Generate all badges and ZIP for download
6. Polish theme detection and UI adaptation

## Technologies
- HTML5, CSS3 (responsive, theme-aware)
- JavaScript (Canvas, FileReader, JSZip)
- Google Fonts (Google Sans, Google Sans Mono)
- Third-party libraries: PapaParse (CSV), SheetJS (XLSX), JSZip (ZIP)

## Next Steps
- Implement file parsing and badge rendering logic in `site.js`
- Add configuration modal
- Integrate ZIP download
- Finalize theme adaptation
