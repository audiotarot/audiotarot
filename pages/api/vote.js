import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, type } = req.body
    const field = type === 'up' ? 'upvotes' : 'downvotes'

    const updated = await prisma.suggestion.update({
      where: { id },
      data: { [field]: { increment: 1 } },
    })

    res.json(updated)
  }
}
