// pages/embed/thefool.js
import React, { useState, useEffect } from 'react'

export default function TheFoolEmbed() {
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    fetch('https://audiotarot-git-main-audiotarots-projects.vercel.app/api/suggestions')
      .then((res) => res.json())
      .then(setSuggestions)
      .catch(console.error)
  }, [])

  return (
    <div style={{
      backgroundColor: '#111',
      color: '#fff',
      fontFamily: '"Courier New", Courier, monospace',
      padding: '2rem',
      maxWidth: '700px',
      margin: '0 auto',
    }}>
      <h2>🎧 Community Suggestions for The Fool</h2>
      {suggestions.length === 0
        ? <p>No suggestions yet.</p>
        : suggestions.map(s => (
            <div key={s.id} style={{ marginBottom: '1.5rem' }}>
              <strong>{s.trackName}</strong> by {s.artist}<br/>
              <iframe
                src={`https://open.spotify.com/embed/track/${s.trackId}`}
                width="300" height="80" frameBorder="0" allow="encrypted-media" loading="lazy"
                style={{ marginTop: '0.5rem' }}
              />
            </div>
          ))
      }
    </div>
  )
}
