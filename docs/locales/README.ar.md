# صانع بطاقات DevFest 2026

**قراءة هذا بلغات أخرى:**  
[English](../../README.md) | [Español](README.es.md) | [Français](README.fr.md) | [Português](README.pt.md) | [Èdè Yorùbá](README.yo.md) | [Deutsch](README.de.md) | [Türkçe](README.tr.md) | [العربية](README.ar.md) | [हिन्दी](README.hi.md) | [日本語](README.ja.md) | [Kiswahili](README.sw.md)

يقوم DevFest Badge Creator بتحويل بيانات الحضور إلى بطاقات DevFest جاهزة للطباعة. يدعم ملفات CSV و XLSX و JSON، ويعرض معاينة لأول بطاقة صالحة، ويقوم بتنزيل جميع البطاقات المنشأة كملف ZIP.

التطبيق المباشر: https://devfestbadge.web.app

<img src="../../public/images/icon/badge_logo.png" width="400" alt="DevFest Badge Creator logo">

## الميزات

1. تحميل بيانات الحضور بتنسيق CSV أو XLSX أو JSON.
2. مراجعة معاينة أول بطاقة تم إنشاؤها.
3. تنزيل جميع البطاقات الصالحة كملف ZIP.

التطبيق خفيف وسريع. يتم إنشاء البطاقات مباشرة داخل المتصفح باستخدام Canvas.

## تنسيق البيانات

الملفات النموذجية متوفرة في `public/files` (بما في ذلك `public/files/ar/sample.csv`).

الحقول الموصى بها:
- `location` (مطلوب)
- `firstname` (مطلوب)
- `lastname` (مطلوب)
- `title` (اختياري)
- `organization` (اختياري)
- `participationType` (اختياري: `Attendee` أو `Speaker` أو `General` أو `Staff`)

## التطوير المحلي

```powershell
http-server ./public -p 8082
```

افتح http://127.0.0.1:8082 في متصفحك.
