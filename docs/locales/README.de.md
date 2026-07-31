# DevFest 2026 Badge-Ersteller

**In anderen Sprachen lesen:**  
[English](../../README.md) | [Español](README.es.md) | [Français](README.fr.md) | [Português](README.pt.md) | [Èdè Yorùbá](README.yo.md) | [Deutsch](README.de.md) | [Türkçe](README.tr.md) | [العربية](README.ar.md) | [हिन्दी](README.hi.md) | [日本語](README.ja.md) | [Kiswahili](README.sw.md)

DevFest Badge Creator verwandelt Teilnehmerdaten in druckfertige DevFest-Badges. Es unterstützt CSV-, XLSX- und JSON-Dateien, zeigt eine Vorschau des ersten gültigen Badges und lädt alle erstellten Badges als ZIP-Datei herunter.

Live-App: https://devfestbadge.web.app

<img src="../../public/images/icon/badge_logo.png" width="400" alt="DevFest Badge Creator logo">

## Funktionen

1. Laden Sie Teilnehmerdaten im Format CSV, XLSX oder JSON hoch.
2. Überprüfen Sie die Vorschau des ersten generierten Badges.
3. Laden Sie alle gültigen Badges als ZIP herunter.

Die App ist statisch und leichtgewichtig. Das Rendering erfolgt direkt im Browser mit Canvas.

## Datenformat

Beispieldateien finden Sie unter `public/files` (inklusive `public/files/de/sample.csv`).

Empfohlene Felder:
- `stadt` / `location` (Erforderlich)
- `vorname` / `firstname` (Erforderlich)
- `nachname` / `lastname` (Erforderlich)
- `titel` / `title` (Optional)
- `firma` / `organization` (Optional)
- `typ` / `participationType` (Optional: `Attendee`, `Speaker`, `General` oder `Staff`)

## Lokale Entwicklung

```powershell
http-server ./public -p 8082
```

Öffnen Sie http://127.0.0.1:8082 im Browser.
