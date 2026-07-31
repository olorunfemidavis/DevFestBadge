# Créateur de Badges DevFest 2026

**Lire ceci dans d'autres langues :**  
[English](../../README.md) | [Español](README.es.md) | [Français](README.fr.md) | [Português](README.pt.md) | [Èdè Yorùbá](README.yo.md) | [Deutsch](README.de.md) | [Türkçe](README.tr.md) | [العربية](README.ar.md) | [हिन्दी](README.hi.md) | [日本語](README.ja.md) | [Kiswahili](README.sw.md)

DevFest Badge Creator transforme les données des participants en badges DevFest prêts à imprimer. Il prend en charge les fichiers CSV, XLSX et JSON, affiche un aperçu du premier badge valide et télécharge tous les badges générés dans un fichier ZIP.

Application en direct : https://devfestbadge.web.app

<img src="../../public/images/icon/badge_logo.png" width="400" alt="DevFest Badge Creator logo">

## Fonctionnalités

1. Importez les données des participants au format CSV, XLSX ou JSON.
2. Vérifiez l'aperçu du premier badge généré.
3. Téléchargez tous les badges valides au format ZIP.

L'application est statique et légère. Le rendu des badges s'effectue dans le navigateur via Canvas, évitant tout envoi de données vers un serveur.

## Format des Données

Des fichiers d'exemple sont disponibles dans `public/files` (notamment `public/files/fr/sample.csv`).

Champs recommandés :
- `ville` / `location` (Obligatoire)
- `prenom` / `firstname` (Obligatoire)
- `nom` / `lastname` (Obligatoire)
- `titre` / `title` (Optionnel)
- `societe` / `organization` (Optionnel)
- `type` / `participationType` (Optionnel : `Attendee`, `Speaker`, `General`, ou `Staff`)

## Développement Local

```powershell
http-server ./public -p 8082
```

Ouvrez http://127.0.0.1:8082 dans votre navigateur.
