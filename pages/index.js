import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>Welcome to AudioTarot</h1>
      <p>This is the homepage. Choose a card to explore.</p>
      <Link href="/thefool">🃏 View The Fool</Link>
    </main>
  )
}