# Mtengenezaji wa Baji za DevFest 2026

**Soma hii kwa lugha zingine:**  
[English](../../README.md) | [Español](README.es.md) | [Français](README.fr.md) | [Português](README.pt.md) | [Èdè Yorùbá](README.yo.md) | [Deutsch](README.de.md) | [Türkçe](README.tr.md) | [العربية](README.ar.md) | [हिन्दी](README.hi.md) | [日本語](README.ja.md) | [Kiswahili](README.sw.md)

DevFest Badge Creator inabadilisha data za washiriki kuwa baji za DevFest tayari kwa kuchapishwa. Inasaidia faili za CSV, XLSX, na JSON, inaonyesha hakisho ya baji ya kwanza halali, na kupakua baji zote zilizotengenezwa kama faili ya ZIP.

Programu ya moja kwa moja: https://devfestbadge.web.app

<img src="../../public/images/icon/badge_logo.png" width="400" alt="DevFest Badge Creator logo">

## Inachofanya

1. Pakia data za washiriki katika mfumo wa CSV, XLSX, au JSON.
2. Kagua hakisho ya baji ya kwanza iliyotengenezwa.
3. Pakua baji zote halali kama ZIP.

Programu hii ni nyepesi na ya haraka. Kutengeneza baji hufanyika moja kwa moja kwenye kivinjari chako kwa kutumia Canvas.

## Mfumo wa Data

Faili za mfano zinapatikana katika `public/files` (pamoja na `public/files/sw/sample.csv`).

Sehemu zinazopendekezwa:
- `mahali` / `location` (Lazima)
- `jinakwanza` / `firstname` (Lazima)
- `jinapili` / `lastname` (Lazima)
- `cheo` / `title` (Hiyari)
- `shirika` / `organization` (Hiyari)
- `aina` / `participationType` (Hiyari: `Attendee`, `Speaker`, `General`, au `Staff`)

## Maendeleo ya Eneo Lako (Local Development)

```powershell
http-server ./public -p 8082
```

Fungua http://127.0.0.1:8082 kwenye kivinjari chako.
