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
    <main style={{ fontFamily: '"Courier New", Courier, monospace', color: '#fff', backgroundColor: '#000' }}>
      {/* Static content from Squarespace page */}
      <section>
        <h3>O. The Fool</h3>
        <img
          src="https://images.squarespace-cdn.com/content/v1/5a43db3ea9db09f77e907232/1540695253539-552A57S83RXTI6CSNFV0/thefool.jpg?format=1000w"
          alt="silhouette of a person leaping between cliffs above the ocean at sunrise"
          style={{ width: '100%' }}
        />

        <h2>🔑 Keywords</h2>
        <p>
          <strong>Sign:</strong> Aquarius • <strong>Planet:</strong> Uranus
        </p>
        <p>
          new beginnings, sacred foolishness, leaps of faith, curiosity,
          instinct, openness, risk, untethered, idealism, raw potential,
          intuition over logic, freedom from expectation.
        </p>

        <h2>⬆️ Upright</h2>
        <p>
          You are standing at the edge of something real. The Fool doesn&apos;t need a map.
          Just a pulse, a yes, and a reason to trust that the fall might become flight.
          Step toward the unknown because it stirs you, not because it makes sense.
        </p>

        <h2>⬇️ Reversed</h2>
        <p>
          This isn&apos;t freedom, but flailing. A refusal to listen, or a fear dressed up as
          recklessness. When The Fool stumbles, it&apos;s often because they mistook impulse
          for insight. Step back. Are you leaping for freedom, or out of fear of stillness?
        </p>

        <h2>🎵 Featured Lyric</h2>
        <blockquote style={{ borderLeft: '3px solid #666', paddingLeft: '12px', color: '#666', fontStyle: 'italic', fontFamily: '"Courier New", Courier, monospace' }}>
          Trancin&#39; round a field of joy<br />
          I change from girl to boy<br />
          Can you deliver fun from cruel?<br />
          Could you laugh at truth with a fool?<br />
          —Curved Air
        </blockquote>

        <h2>🎧 Spotify Playlist</h2>
        <iframe
          src="https://open.spotify.com/embed/playlist/6SDEqI9bMngBcL6DKuWqBv?utm_source=generator"
          width="100%"
          height="152"
          frameBorder="0"
          allow="encrypted-media"
        />

        <h2>🍎 Apple Music</h2>
        <p>
          <a href="https://music.apple.com/us/playlist/0-the-fool/pl.u-XzjEt4L8KmL" target="_blank" rel="noopener noreferrer">
            Open in Apple Music →
          </a>
        </p>

        <h2>🌠 REFLECTION</h2>
        <p>
          What if the risk isn&apos;t falling, but staying exactly where you are? The Fool
          knows every story begins with a step. You don&apos;t have to be ready, just willing.
        </p>
      </section>

      {/* Dynamic search and suggestions section */}
      {!session ? (
        <>
          <p>Please sign in to suggest songs.</p>
          <button onClick={() => signIn('spotify')}>Sign in with Spotify</button>
        </>
      ) : (
        <>
          <p>Welcome, {session.user.name}</p>

          <input
            type="text"
            placeholder="Search for a song..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>

          {results.map((track) => (
            <div key={track.id}>
              <strong>{track.name}</strong> by {track.artists[0].name}
              <button onClick={() => handleSuggest(track)}>Suggest</button>
            </div>
          ))}

          <hr />

          <h2>Community Suggestions</h2>
          {suggestions.length === 0 && <p>No suggestions yet.</p>}

          {suggestions.map((s) => (
            <div key={s.id}>
              <img src={s.image} alt={s.trackName} style={{ width: 64, height: 64 }} />
              <strong>{s.trackName}</strong> by {s.artist}
              <br />
              <iframe
                src={`https://open.spotify.com/embed/track/${s.trackId}`}
                width="300"
                height="80"
                frameBorder="0"
                allow="encrypted-media"
                loading="lazy"
              />
              <div>
                <button onClick={() => vote(s.id, 'up')}>👍 {s.upvotes}</button>
                <button onClick={() => vote(s.id, 'down')}>👎 {s.downvotes}</button>
              </div>
            </div>
          ))}
        </>
      )}
    </main>
  )
}
