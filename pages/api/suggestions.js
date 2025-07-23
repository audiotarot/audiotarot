import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const suggestions = await prisma.suggestion.findMany({
      where: { cardSlug: 'the-fool' },
      orderBy: { upvotes: 'desc' },
    })
    res.json(suggestions)
  }

  if (req.method === 'POST') {
    const { trackId, trackName, artist } = req.body

    console.log('🪄 Received new suggestion:', { trackId, trackName, artist }) // ← This helps us debug

    const newSuggestion = await prisma.suggestion.create({
      data: {
        cardSlug: 'the-fool',
        trackId,
        trackName,
        artist,
      },
    })

    res.status(201).json(newSuggestion)
  }
}
