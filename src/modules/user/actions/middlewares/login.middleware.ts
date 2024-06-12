import jwt from 'jsonwebtoken'
import { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authMiddleware = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const authorization = req.headers['authorization']
    if (!authorization) {
      res.status(401).send({ error: 'Not authorized' })
      return
    }

    const token = authorization.replace('Bearer ', '')
    const { user_id } = jwt.verify(
      token,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZTA4ZTU1ODUtZjRjMi00ODRjLThhNzAtM2MzNGNlNWQyODkzIiwiaWF0IjoxNzE3NzczMTM0fQ.y3C12gPPFo8AOkDEUsH1Hdof7auwMNBYux3wwLMBhz8'
    ) as {
      user_id: string
    }

    const user = await prisma.user.findUnique({ where: { id: user_id } })
    if (!user) {
      res.status(401).send({ error: 'Not authorized' })
      return
    }
    return
  } catch (error) {
    res.status(500).send({ error: 'Internal server error', log: error })
  }
}
