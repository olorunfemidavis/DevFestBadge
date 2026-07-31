# DevFest 2026 बैज क्रिएटर

**इसे अन्य भाषाओं में पढ़ें:**  
[English](../../README.md) | [Español](README.es.md) | [Français](README.fr.md) | [Português](README.pt.md) | [Èdè Yorùbá](README.yo.md) | [Deutsch](README.de.md) | [Türkçe](README.tr.md) | [العربية](README.ar.md) | [हिन्दी](README.hi.md) | [日本語](README.ja.md) | [Kiswahili](README.sw.md)

DevFest Badge Creator अटेंडी डेटा को प्रिंट के लिए तैयार DevFest बैज में बदलता है। यह CSV, XLSX और JSON फ़ाइलों का समर्थन करता है, पहले मान्य बैज का पूर्वावलोकन दिखाता है, और सभी उत्पन्न बैज को ZIP फ़ाइल के रूप में डाउनलोड करता है।

लाइव ऐप: https://devfestbadge.web.app

<img src="../../public/images/icon/badge_logo.png" width="400" alt="DevFest Badge Creator logo">

## यह क्या करता है

1. CSV, XLSX या JSON प्रारूप में अटेंडी डेटा अपलोड करें।
2. पहले उत्पन्न बैज पूर्वावलोकन की समीक्षा करें।
3. सभी मान्य बैज को ZIP के रूप में डाउनलोड करें।

ऐप हल्का और तेज़ है। बैज रेंडरिंग कैनवास के साथ ब्राउज़र में होती है।

## डेटा प्रारूप

नमूना फ़ाइलें `public/files` में उपलब्ध हैं।

अनुशंसित फ़ील्ड:
- `location` (आवश्यक)
- `firstname` (आवश्यक)
- `lastname` (आवश्यक)
- `title` (वैकल्पिक)
- `organization` (वैकल्पिक)
- `participationType` (वैकल्पिक: `Attendee`, `Speaker`, `General`, या `Staff`)

## स्थानीय विकास

```powershell
http-server ./public -p 8082
```

ब्राउज़र में http://127.0.0.1:8082 खोलें।
