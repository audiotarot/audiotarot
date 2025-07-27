// pages/embed/thefool.js
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function TheFoolEmbed() {
  const BASE = 'https://audiotarot-git-main-audiotarots-projects.vercel.app'
  const { data: session } = useSession()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [suggestions, setSuggestions] = useState([])

  // Fetch existing suggestions
  useEffect(() => {
    fetch(`${BASE}/api/suggestions`)
      .then(r => r.json())
      .then(setSuggestions)
      .catch(console.error)
  }, [])

  // Spotify search
  const handleSearch = async () => {
    try {
      const res = await fetch(
        `${BASE}/api/search?q=${encodeURIComponent(query)}`
      )
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setResults(data.tracks.items || [])
    } catch {
      alert('Could not search Spotify.')
    }
  }

  // Submit a suggestion
  const handleSuggest = async (track) => {
    try {
      const res = await fetch(`${BASE}/api/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardSlug: 'the-fool',
          trackId: track.id,
          trackName: track.name,
          artist: track.artists[0].name,
          image: track.album.images[0]?.url || '',
          url: track.external_urls.spotify,
        }),
      })
      if (!res.ok) throw new Error()
      const newSug = await res.json()
      setSuggestions(prev => [newSug, ...prev])
    } catch {
      alert('Could not submit your suggestion.')
    }
  }

  // Up/down vote
  const vote = async (id, type) => {
    try {
      const res = await fetch(`${BASE}/api/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setSuggestions(prev => prev.map(s => s.id === updated.id ? updated : s))
    } catch {
      alert('Voting failed.')
    }
  }

  // Encoded callback for new‑tab OAuth
  const callback = encodeURIComponent(`${BASE}/embed/thefool`)

  return (
    <div style={{
      backgroundColor: '#111',
      color: '#fff',
      fontFamily: '"Courier New", Courier, monospace',
      padding: '2rem',
      maxWidth: '700px',
      margin: '0 auto'
    }}>
      <h2>🎧 Community Suggestions for The Fool</h2>

      {!session ? (
        <>
          <p>Please sign in to suggest songs.</p>
          <button
            onClick={() =>
              window.open(
                `${BASE}/api/auth/signin/spotify?callbackUrl=${callback}`,
                '_blank'
              )
            }
            style={{
              background: '#000',
              color: '#fff',
              padding: '0.5rem 1rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Sign in with Spotify
          </button>
        </>
      ) : (
        <>
          <p>Welcome, {session.user.name}</p>

          <div style={{ margin: '1rem 0' }}>
            <input
              type="text"
              placeholder="Search for a song..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ width: '70%', marginRight: '0.5rem' }}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          {results.map(track => (
            <div key={track.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{track.name}</strong> by {track.artists[0].name}{' '}
              <button onClick={() => handleSuggest(track)}>Suggest</button>
            </div>
          ))}

          <hr style={{ borderColor: '#444', margin: '2rem 0' }} />

          {suggestions.length === 0 && <p>No suggestions yet.</p>}

          {suggestions.map(s => (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', marginBottom: '1rem'
            }}>
              <img
                src={s.image}
                alt={s.trackName}
                style={{ width: 64, height: 64, marginRight: '1rem' }}
              />
              <div style={{ flex: 1 }}>
                <strong>{s.trackName}</strong> by {s.artist}
                <br/>
                <iframe
                  src={`https://open.spotify.com/embed/track/${s.trackId}`}
                  width="300" height="80" frameBorder="0"
                  allow="encrypted-media" loading="lazy"
                  style={{ marginTop: '0.5rem' }}
                />
                <div>
                  <button onClick={() => vote(s.id, 'up')}>
                    👍 {s.upvotes}
                  </button>{' '}
                  <button onClick={() => vote(s.id, 'down')}>
                    👎 {s.downvotes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
