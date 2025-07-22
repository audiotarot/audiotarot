// pages/api/search.js

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Missing query' });
  }

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  // Get access token from Spotify
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // Search Spotify
  const searchRes = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!searchRes.ok) {
    return res.status(searchRes.status).json({ error: 'Spotify search failed' });
  }

  const data = await searchRes.json();
  return res.status(200).json(data);
}
