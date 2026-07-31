# DevFest 2026 Yaka Kartı Oluşturucu

**Diğer dillerde oku:**  
[English](../../README.md) | [Español](README.es.md) | [Français](README.fr.md) | [Português](README.pt.md) | [Èdè Yorùbá](README.yo.md) | [Deutsch](README.de.md) | [Türkçe](README.tr.md) | [العربية](README.ar.md) | [हिन्दी](README.hi.md) | [日本語](README.ja.md) | [Kiswahili](README.sw.md)

DevFest Badge Creator, katılımcı verilerini baskıya hazır DevFest yaka kartlarına dönüştürür. CSV, XLSX ve JSON dosyalarını destekler, ilk geçerli kartın önizlemesini sunar ve oluşturulan tüm kartları ZIP dosyası olarak indirir.

Canlı uygulama: https://devfestbadge.web.app

<img src="../../public/images/icon/badge_logo.png" width="400" alt="DevFest Badge Creator logo">

## Özellikler

1. Katılımcı verilerini CSV, XLSX veya JSON formatında yükleyin.
2. İlk oluşturulan yaka kartının önizlemesini inceleyin.
3. Geçerli tüm yaka kartlarını ZIP olarak indirin.

Uygulama statik ve hafiftir. Kart oluşturma işlemi tarayıcıda Canvas ile gerçekleşir.

## Veri Formatı

Örnek dosyalar `public/files` dizininde mevcuttur (`public/files/tr/sample.csv` dahil).

Önerilen alanlar:
- `sehir` / `location` (Zorunlu)
- `ad` / `firstname` (Zorunlu)
- `soyad` / `lastname` (Zorunlu)
- `unvan` / `title` (İsteğe bağlı)
- `sirket` / `organization` (İsteğe bağlı)
- `tur` / `participationType` (İsteğe bağlı: `Attendee`, `Speaker`, `General` veya `Staff`)

## Yerel Geliştirme

```powershell
http-server ./public -p 8082
```

Tarayıcınızda http://127.0.0.1:8082 adresini açın.
