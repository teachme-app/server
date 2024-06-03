import argon2 from 'argon2'
import z from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { createUserAction } from '../actions/user.action'
import { prisma } from '../../lib/prisma'

export const createUser = async (req: FastifyRequest, res: FastifyReply) => {
  const userObject = z.object({
    email: z.string().email(),
    name: z.string(),
    document: z.string(),
    password: z.string(),
    birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    phone: z.string(),
    adress: z.string().optional(),
  })

  const user = userObject.safeParse(req.body)

  if (!user.success) {
    if (Array.isArray(user.error)) {
      res.status(400).send(user.error.map((error) => error.message).join(', '))
    } else if (user.error && typeof user.error.message === 'string') {
      res.status(400).send(user.error.message)
    } else {
      res.status(500).send('Unknown error')
    }
  } else {
    const { email, name, document, password, birth_date, phone, adress } = user.data

    const password_hash = await argon2.hash(password)

    return createUserAction({ email, name, document, password_hash, birth_date, phone, adress })
  }
}

export const getUser = async () => {
  return prisma.user.findMany()
}
