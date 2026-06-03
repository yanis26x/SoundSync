# SoundSync

SoundSync est une application web qui a pour objectif de transférer des playlists entre différentes plateformes musicales.

Exemples :

```txt
Spotify → YouTube Music
YouTube Music → Spotify
Apple Music → Spotify
```

## Problème actuel

La récupération des playlists Spotify est actuellement bloquée par Spotify :

```txt
Active premium subscription required for the owner of the app.
```

Il faudra donc utiliser un compte Spotify Premium ou trouver une autre solution avant de continuer l'intégration Spotify.

## Prochaines étapes

* Récupérer les playlists Spotify
* Permettre la sélection d'une playlist
* Ajouter l'authentification YouTube
* Créer automatiquement une playlist sur la plateforme de destination
* Ajouter les morceaux dans la nouvelle playlist
* Améliorer l'interface utilisateur

## Lancer le projet

Backend :

```bash
cd backend
npm install
npm run dev
```

Frontend :

```bash
cd frontend
npm install
npm run dev
```

Backend :

```txt
http://127.0.0.1:8000
```

Frontend :

```txt
http://localhost:5173
```
