# Olùṣèdá Káàdì DevFest 2026

**Kà á ní àwọn èdè míràn:**  
[English](../../README.md) | [Español](README.es.md) | [Français](README.fr.md) | [Português](README.pt.md) | [Èdè Yorùbá](README.yo.md) | [Deutsch](README.de.md) | [Türkçe](README.tr.md) | [العربية](README.ar.md) | [हिन्दी](README.hi.md) | [日本語](README.ja.md) | [Kiswahili](README.sw.md)

DevFest Badge Creator ń yí àwọn ìsọfúnni àwọn alántẹ́ sí káàdì DevFest tó ṣeé tẹ̀ jade. Ó gba àwọn fáìlì CSV, XLSX, àti JSON, ó ń ṣe àfihàn káàdì àkọ́kọ́ tó dára, ó sì ń gba gbogbo àwọn káàdì náà síbẹ̀ gẹ́gẹ́ bí fáìlì ZIP.

Wẹ́ẹ̀bù lórí ẹ̀rọ: https://devfestbadge.web.app

<img src="../../public/images/icon/badge_logo.png" width="400" alt="DevFest Badge Creator logo">

## Nǹkan tó ń ṣe

1. Tẹ ìsọfúnni àwọn alántẹ́ síbẹ̀ nínú CSV, XLSX, tàbí JSON.
2. Wo àfihàn káàdì àkọ́kọ́ náà.
3. Gba gbogbo àwọn káàdì náà síbẹ̀ gẹ́gẹ́ bí fáìlì ZIP.

## Àwọn orúkọ ayé (Data Format)

Fáìlì àpẹẹrẹ wà ní `public/files` (tí ó pẹ̀lú `public/files/yo/sample.csv`).

Àwọn orúkọ tó yẹ:
- `ibo` / `location` (Mandatory)
- `oruko` / `firstname` (Mandatory)
- `orukolast` / `lastname` (Mandatory)
- `ipo` / `title` (Optional)
- `egbe` / `organization` (Optional)
- `tipo` / `participationType` (Optional: `Attendee`, `Speaker`, `General`, tàbí `Staff`)

## Ìgbésẹ̀ lórí Ẹ̀rọ yín (Local Development)

```powershell
http-server ./public -p 8082
```

Ṣí http://127.0.0.1:8082 nínú ẹ̀rọ wẹ́ẹ̀bù rẹ.
