import { useSession, signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function TheFool() {
  const { data: session } = useSession()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [suggestions, setSuggestions] = useState([])

  // 1) Fetch existing suggestions on mount
  useEffect(() => {
    fetch('/api/suggestions')
      .then((res) => res.json())
      .then(setSuggestions)
      .catch(console.error)
  }, [])

  // 2) Search Spotify
  const handleSearch = async () => {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setResults(data?.tracks?.items || [])
    } catch (err) {
      console.error(err)
      alert('Sorry, could not search Spotify right now.')
    }
  }

  // 3) Suggest a song (persist to your DB)
  const handleSuggest = async (track) => {
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: track.id,
          trackName: track.name,
          artist: track.artists[0].name,
        }),
      })
      if (!res.ok) throw new Error('Suggest failed')
      const newSug = await res.json()
      setSuggestions((prev) => [newSug, ...prev])
      alert(`Suggested "${track.name}" by ${track.artists[0].name}`)
    } catch (err) {
      console.error(err)
      alert('Oops, could not submit your suggestion.')
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>The Fool</h1>

      {/* Authentication */}
      {!session ? (
        <>
          <p>Please sign in to suggest songs.</p>
          <button onClick={() => signIn('spotify')}>Sign in with Spotify</button>
        </>
      ) : (
        <>
          <p>Welcome, {session.user.name}</p>

          {/* Search bar */}
          <div style={{ margin: '1rem 0' }}>
            <input
              type="text"
              placeholder="Search for a song..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ padding: '0.5rem', width: '60%' }}
            />
            <button onClick={handleSearch} style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}>
              Search
            </button>
          </div>

          {/* Search results */}
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
                <button
                  onClick={() => handleSuggest(track)}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '4px',
                  }}
                >
                  Suggest this song
                </button>
              </div>
            ))}
          </div>

          {/* Divider */}
          <hr style={{ margin: '2rem 0' }} />

          {/* Community Suggestions */}
          <h2>Community Suggestions</h2>
          {suggestions.length === 0 && <p>No suggestions yet. Be the first!</p>}
          <ul>
            {suggestions.map((s) => (
              <li key={s.id} style={{ marginBottom: '0.8rem' }}>
                <strong>{s.trackName}</strong> by {s.artist}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}

