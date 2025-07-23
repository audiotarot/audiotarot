import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id, type } = req.body
  if (!id || (type !== 'up' && type !== 'down')) {
    return res.status(400).json({ error: 'Invalid vote payload' })
  }

  try {
    const updated = await prisma.suggestion.update({
      where: { id: Number(id) },
      data: type === 'up'
        ? { upvotes: { increment: 1 } }
        : { downvotes: { increment: 1 } },
    })
    res.json(updated)
  } catch (err) {
    console.error('Vote error:', err)
    res.status(500).json({ error: 'Voting failed' })
  }
}
