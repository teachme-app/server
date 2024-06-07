import argon2 from 'argon2'
import z from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { createUserAction, getUserByEmail, updateUserAction } from '../actions/user.action'
import { prisma } from '../../lib/prisma'
import jwt from 'jsonwebtoken'

export const createUser = async (req: FastifyRequest, res: FastifyReply) => {
  const userObject = z.object({
    email: z.string().email(),
    name: z.string(),
    document: z.string(), // .regex(/^[0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2}([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})$/)
    password: z.string().min(8),
    birth_date: z.string().regex(/^\d{2}-\d{2}-\d{4}$/),
    phone: z.string().regex(/^\(?[1-9]{2}\)? ?(?:[2-8]|9[0-9])[0-9]{3}\-?[0-9]{4}$/),
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

export const loginUser = async (req: FastifyRequest, res: FastifyReply) => {
  const loginUserObject = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'The password needs to be 8 characters'),
  })

  const user = loginUserObject.safeParse(req.body)

  if (user.success) {
    const { email, password } = user.data

    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        res.code(401).send({ error: 'Incorrect email or password' })
        return
      }

      const isPasswordValid = await argon2.verify(user.password_hash, password)
      if (!isPasswordValid) {
        res.code(401).send({ error: 'Incorrect email or password' })
      }

      const token = jwt.sign(
        { user_id: user.id },
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZTA4ZTU1ODUtZjRjMi00ODRjLThhNzAtM2MzNGNlNWQyODkzIiwiaWF0IjoxNzE3NzczMTM0fQ.y3C12gPPFo8AOkDEUsH1Hdof7auwMNBYux3wwLMBhz8'
      )

      res.send({ token })
    } catch (e) {
      res.code(500).send({ error: 'An error occurred while trying to log in' })
    }
  } else {
    res.code(400).send({ error: 'Invalid email or password' })
  }
}

export const updateUser = async (req: FastifyRequest, res: FastifyReply) => {
  const userObject = z.object({
    email: z.string().email().optional(),
    name: z.string().optional(),
    document: z.string().optional(), // .regex(/^[0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2}([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})$/)
    password: z.string().min(8).optional(),
    birth_date: z
      .string()
      .regex(/^\d{2}-\d{2}-\d{4}$/)
      .optional(),
    phone: z
      .string()
      .regex(/^\(?[1-9]{2}\)? ?(?:[2-8]|9[0-9])[0-9]{3}\-?[0-9]{4}$/)
      .optional(),
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

    const { id } = req.params

    const password_hash = await argon2.hash(password)

    return updateUserAction(id, { email, name, document, password_hash, birth_date, phone, adress })
  }
}
