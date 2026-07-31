# Criador de Crachás DevFest 2026

**Ler isto em outros idiomas:**  
[English](../../README.md) | [Español](README.es.md) | [Français](README.fr.md) | [Português](README.pt.md) | [Èdè Yorùbá](README.yo.md) | [Deutsch](README.de.md) | [Türkçe](README.tr.md) | [العربية](README.ar.md) | [हिन्दी](README.hi.md) | [日本語](README.ja.md) | [Kiswahili](README.sw.md)

O DevFest Badge Creator transforma dados de participantes em crachás prontos para impressão do DevFest. Ele suporta arquivos CSV, XLSX e JSON, exibe uma prévia do primeiro crachá válido e baixa todos os crachás gerados em um arquivo ZIP.

Aplicação ao vivo: https://devfestbadge.web.app

<img src="../../public/images/icon/badge_logo.png" width="400" alt="DevFest Badge Creator logo">

## O que ele faz?

1. Envie dados dos participantes nos formatos CSV, XLSX ou JSON.
2. Visualize a prévia do primeiro crachá gerado.
3. Baixe todos os crachás válidos em formato ZIP.

A aplicação é estática e leve. O processamento dos crachás é feito inteiramente no navegador usando Canvas.

## Formato dos Dados

Arquivos de exemplo disponíveis em `public/files` (incluindo `public/files/pt/sample.csv`).

Campos recomendados:
- `cidade` / `location` (Obrigatório)
- `nome` / `firstname` (Obrigatório)
- `sobrenome` / `lastname` (Obrigatório)
- `cargo` / `title` (Opcional)
- `empresa` / `organization` (Opcional)
- `tipo` / `participationType` (Opcional: `Attendee`, `Speaker`, `General`, ou `Staff`)

## Desenvolvimento Local

```powershell
http-server ./public -p 8082
```

Abra http://127.0.0.1:8082 no seu navegador.
