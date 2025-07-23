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
      setResults(data?.tracks?.items || [])
    } catch (err) {
      console.error(err)
      alert('Sorry, could not search Spotify right now.')
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
            <button onClick={handleSearch} style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}>
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

          <hr style={{ margin: '2rem 0' }} />

          <h2>Community Suggestions</h2>
          {suggestions.length === 0 && <p>No suggestions yet. Be the first!</p>}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {suggestions.map((s) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={s.image} alt={s.trackName} style={{ width: '64px', height: '64px', borderRadius: '8px' }} />
                <div>
                  <strong>{s.trackName}</strong> by {s.artist}
                  <br />
                  <a href={s.url} target="_blank" rel="noopener noreferrer">🎧 Listen on Spotify</a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}

