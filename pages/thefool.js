import { useSession, signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function TheFool() {
  const { data: session } = useSession()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    fetch('/api/suggestions')
      .then((res) => res.json())
      .then(setSuggestions)
      .catch(console.error)
  }, [])

  const handleSearch = async () => {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setResults(data.tracks.items || [])
    } catch {
      alert('Could not search Spotify.')
    }
  }

  const handleSuggest = async (track) => {
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: track.id,
          trackName: track.name,
          artist: track.artists[0].name,
          image: track.album.images[0]?.url || '',
          url: track.external_urls.spotify,
        }),
      })
      if (!res.ok) throw new Error()
      const newSug = await res.json()
      setSuggestions((prev) => [newSug, ...prev])
    } catch {
      alert('Could not submit your suggestion.')
    }
  }

  const vote = async (id, type) => {
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setSuggestions((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      )
    } catch {
      alert('Voting failed.')
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>The Fool</h1>
      {!session ? (
        <>
          <p>Please sign in to suggest songs.</p>
          <button onClick={() => signIn('spotify')}>Sign in with Spotify</button>
        </>
      ) : (
        <>
          <p>Welcome, {session.user.name}</p>

          <div style={{ margin: '1rem 0' }}>
            <input
              type="text"
              placeholder="Search for a song..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ padding: '0.5rem', width: '60%' }}
            />
            <button onClick={handleSearch} style={{ marginLeft: '0.5rem' }}>
              Search
            </button>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {results.map((track) => (
              <div
                key={track.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                }}
              >
                <p>
                  <strong>{track.name}</strong> by {track.artists[0].name}
                </p>
                <button onClick={() => handleSuggest(track)}>
                  Suggest this song
                </button>
              </div>
            ))}
          </div>

          <hr style={{ margin: '2rem 0' }} />

          <h2>Community Suggestions</h2>
          {suggestions.length === 0 && <p>No suggestions yet.</p>}

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {suggestions.map((s) => (
              <div
                key={s.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <img
                  src={s.image}
                  alt={s.trackName}
                  style={{ width: 64, height: 64, borderRadius: 4 }}
                />
                <div style={{ flex: 1 }}>
                  <strong>{s.trackName}</strong> by {s.artist}
                  <br />
                  <iframe
                    src={`https://open.spotify.com/embed/track/${s.trackId}`}
                    width="300"
                    height="80"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                  <div style={{ marginTop: '0.5rem' }}>
                    <button onClick={() => vote(s.id, 'up')}>👍 {s.upvotes}</button>{' '}
                    <button onClick={() => vote(s.id, 'down')}>👎 {s.downvotes}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
