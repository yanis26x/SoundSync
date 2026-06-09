# SoundSync𖤐

SoundSync est une application web qui permet de transférer des playlists entre différentes plateformes musicales.


## Fonctionnalités actuelles

✅ Connexion avec Spotify

✅ Récupération des playlists Spotify

✅ Connexion avec YouTube

✅ Système de thèmes personnalisés

✅ Interface moderne avec plusieurs thèmes visuels

🚧 Transfert de playlists (en développement)

---

## Lancer le projet

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend :

```txt
http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend :

```txt
http://localhost:5173
```

---

## Configuration

Créer un fichier `.env` dans le dossier `backend` :

```env
PORT=8000

# Spotify
SPOTIFY_CLIENT_ID=ton_client_id
SPOTIFY_CLIENT_SECRET=ton_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:8000/auth/spotify/callback

# Google / YouTube
GOOGLE_CLIENT_ID=ton_google_client_id
GOOGLE_CLIENT_SECRET=ton_google_client_secret
GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/auth/google/callback
```

---

## Spotify

Dans le Spotify Developer Dashboard, ajouter :

```txt
http://127.0.0.1:8000/auth/spotify/callback
```

comme Redirect URI.

---

## YouTube / Google OAuth

Dans Google Cloud Console, ajouter :

```txt
http://127.0.0.1:8000/auth/google/callback
```

dans les URI de redirection autorisées.

### Utilisateurs de test

Actuellement, l'application Google est en mode test.

Par défaut, seul :

```txt
yanis26x@gmail.com
```

peut se connecter.

Pour ajouter d'autres utilisateurs :

```txt
Google Cloud Console
↓
Google Auth Platform
↓
Audience
↓
Utilisateurs tests
↓
Ajouter des utilisateurs
```

Ajoutez ensuite les adresses Gmail souhaitées.

---

## Plateformes prévues

🚧 YouTube Music

🚧 Apple Music

🚧 SoundCloud

🚧 Deezer

---

## Prochaines étapes

- Sélection d'une playlist Spotify
- Création automatique d'une playlist YouTube
- Importation des morceaux Spotify vers YouTube
- Support Apple Music
- Support SoundCloud
- Historique des transferts
- Améliorations de l'interface utilisateur

---

Développé par Yanis26x.