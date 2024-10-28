# Spotify Video App

This application fetches songs from a Spotify playlist and generates an After Effects script that adds text layers for each song at specified intervals.

## Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine. You can start the site using these commands:

```bash
npm install
npm run dev
```

You'll also need a .env file in the parent directory with your Spotify Client Key and Secret, like so:
```bash
VITE_SPOTIFY_CLIENT_ID=client_id_here
VITE_SPOTIFY_CLIENT_SECRET=client_secret
```

## After Effects
Once you have the generated script, run the script by going to File > Script > Run Script.

## Versions
Tested on Node.JS version v11.15.0 and After Effects Version 25.0
