import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

function App() {
  const [playlistLink, setPlaylistLink] = useState('');
  const [songs, setSongs] = useState([]);
  const [downloadLink, setDownloadLink] = useState('');

  const handleButtonClick = async () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    try {
      // Extract the playlist ID from the playlist link
      const playlistId = playlistLink.split('/').pop().split('?')[0];

      // Step 1: Get access token using client credentials flow
      const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
        headers: {
          'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
          grant_type: 'client_credentials'
        }
      });

      const accessToken = tokenResponse.data.access_token;

      // Step 2: Fetch the playlist tracks
      const playlistResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // Extract song titles
      const trackTitles = playlistResponse.data.items.map(item => item.track.name);
      setSongs(trackTitles); // Set songs to state
      generateScript(trackTitles); // Generate the script based on the fetched songs
    } catch (error) {
      console.error("Error fetching playlist data:", error.response ? error.response.data : error.message);
    }
  };

  const generateScript = (songs) => {
    // Generate the After Effects script
    const scriptLines = songs.map((song, index) => {
      const time = index * 5; // 5-second intervals
      return `var textLayer${index} = app.project.activeItem.layers.addText("${song}");\n` +
             `textLayer${index}.transform.position.setValue([960, 540]); // Centered position\n` +
             `textLayer${index}.inPoint = ${time};\n` +
             `textLayer${index}.outPoint = ${time + 5};\n`; // Display for 5 seconds
    });

    const scriptContent = scriptLines.join('\n');

    // Create a Blob for the script and generate a download link
    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    setDownloadLink(url);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
    >
      <Container maxWidth="sm">
        <Typography variant="h3" gutterBottom>
          Spotify Video App
        </Typography>

        <TextField
          label="Paste Spotify Playlist Link Here"
          variant="outlined"
          fullWidth
          margin="normal"
          value={playlistLink}
          onChange={(e) => setPlaylistLink(e.target.value)}
          sx={{
            backgroundColor: 'white',
            borderRadius: 1,
          }}
        />

        <Box marginTop={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
          >
            Generate Script
          </Button>
        </Box>

        {/* Move the download link here */}
        {downloadLink && (
          <Box marginTop={4}>
            <Typography variant="h5">Download Script:</Typography>
            <a href={downloadLink} download="after_effects_script.jsx">
              Click here to download the After Effects script
            </a>
          </Box>
        )}

        <Box marginTop={4}>
          <Typography variant="h5">Songs:</Typography>
          <ul>
            {songs.map((song, index) => (
              <li key={index}>{song}</li>
            ))}
          </ul>
        </Box>
      </Container>
    </Box>
  );
}

export default App;