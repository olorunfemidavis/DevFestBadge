# DevFest 2026 バッジクリエイター

**他の言語で読む:**  
[English](../../README.md) | [Español](README.es.md) | [Français](README.fr.md) | [Português](README.pt.md) | [Èdè Yorùbá](README.yo.md) | [Deutsch](README.de.md) | [Türkçe](README.tr.md) | [العربية](README.ar.md) | [हिन्दी](README.hi.md) | [日本語](README.ja.md) | [Kiswahili](README.sw.md)

DevFest Badge Creator は、参加者データを印刷可能な DevFest バッジに変換します。CSV、XLSX、JSON ファイルに対応し、最初の有効なバッジのプレビューを表示し、生成されたすべてのバッジを ZIP ファイルとしてダウンロードできます。

ライブアプリ: https://devfestbadge.web.app

<img src="../../public/images/icon/badge_logo.png" width="400" alt="DevFest Badge Creator logo">

## 機能

1. CSV、XLSX、または JSON 形式で参加者データをアップロードします。
2. 最初に生成されたバッジのプレビューを確認します。
3. すべての有効なバッジを ZIP としてダウンロードします。

バッジのレンダリングは Canvas を使用してブラウザ内で実行されるため、データがサーバーに送信されることはありません。

## データフォーマット

サンプルファイルは `public/files` で利用できます。

推奨フィールド:
- `location` (必須)
- `firstname` (必須)
- `lastname` (必須)
- `title` (任意)
- `organization` (任意)
- `participationType` (任意: `Attendee`, `Speaker`, `General`, または `Staff`)

## ローカル開発

```powershell
http-server ./public -p 8082
```

ブラウザで http://127.0.0.1:8082 を開きます。
