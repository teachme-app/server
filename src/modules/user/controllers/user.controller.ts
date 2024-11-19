import argon2 from 'argon2'
import z from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
  buyCourseAction,
  changeRoleToTeacherAction,
  createUserAction,
  getUserByEmailAction,
  getUserByTokenAction,
  updateUserAction,
} from '../actions/user.action'
import { prisma } from '../../../lib/prisma'
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
    try {
      await createUserAction({ email, name, document, password_hash, birth_date, phone, adress })
      res.send({ message: 'User created successfully' })
    } catch (error) {
      res.status(500).send({ error: error.message })
    }
  }
}

export const getUser = async () => {
  return prisma.user.findMany()
}

export const getUserById = async (req: FastifyRequest, res: FastifyReply) => {
  const idObject = z.object({
    id: z.string(),
  })

  const parsedId = idObject.safeParse(req.params)

  if (!parsedId.success) {
    if (Array.isArray(parsedId.error)) {
      res.status(400).send(parsedId.error.map((error) => error.message).join(', '))
    } else if (parsedId.error && typeof parsedId.error.message === 'string') {
      res.status(400).send(parsedId.error.message)
    } else {
      res.status(500).send('Unknown error')
    }
  } else {
    const { id } = parsedId.data

    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!user) {
        res.status(404).send({ error: 'User not found' })
      }

      res.send(user)
    } catch (error) {
      res.status(500).send({ error: 'An error occurred while trying to get the user' })
    }
  }
}

export const getUserByEmail = async (req: FastifyRequest, res: FastifyReply) => {
  const emailObject = z.object({
    email: z.string().email(),
  })

  const parsedEmail = emailObject.safeParse(req.body)

  if (!parsedEmail.success) {
    if (Array.isArray(parsedEmail.error)) {
      res.status(400).send(parsedEmail.error.map((error) => error.message).join(', '))
    } else if (parsedEmail.error && typeof parsedEmail.error.message === 'string') {
      res.status(400).send(parsedEmail.error.message)
    } else {
      res.status(500).send('Unknown error')
    }
  } else {
    const { email } = parsedEmail.data

    try {
      const user = await getUserByEmailAction(email)
      res.send(user)
    } catch (error) {
      res.status(500).send({ error: 'An error occurred while trying to get the user' })
    }
  }
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
    const { email, name, document, birth_date, phone, adress } = user.data

    const authorization = req.headers['authorization']
    if (!authorization) {
      res.status(401).send({ error: 'Not authorized' })
      return
    }
    const token = authorization.replace('Bearer ', '')
    const userInfo = await getUserByTokenAction(token)

    if (!userInfo) {
      res.status(401).send({ error: 'Not authorized' })
      return
    }

    try {
      await updateUserAction(userInfo.id, { email, name, document, birth_date, phone, adress })
      res.send({ message: 'User updated successfully' })
    } catch (error) {
      res.status(500).send({ error: 'An error occurred while trying to update the user' })
    }
  }
}

export const deleteUser = async (req: FastifyRequest, res: FastifyReply) => {
  const authorization = req.headers['authorization']
  if (!authorization) {
    res.status(401).send({ error: 'Not authorized' })
    return
  }
  const token = authorization.replace('Bearer ', '')
  const userInfo = await getUserByTokenAction(token)

  if (!userInfo) {
    res.status(401).send({ error: 'Not authorized' })
    return
  }

  try {
    await prisma.user.delete({ where: { id: userInfo.id } })
    res.send({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while trying to delete the user' })
  }
}

export const changeRoleToTeacher = async (req: FastifyRequest, res: FastifyReply) => {
  const userObject = z.object({
    graduation: z.string(),
  })

  const user = userObject.safeParse(req.body)

  if (!user.success) {
    res.status(400).send({ error: user.error })
  } else {
    const { graduation } = user.data

    const authorization = req.headers['authorization']
    if (!authorization) {
      res.status(401).send({ error: 'Not authorized' })
      return
    }
    const token = authorization.replace('Bearer ', '')
    const userInfo = await getUserByTokenAction(token)

    if (!userInfo) {
      res.status(401).send({ error: 'Not authorized' })
      return
    }

    try {
      await changeRoleToTeacherAction(userInfo.id, graduation)
      res.send({ message: 'Role changed to teacher successfully' })
    } catch (e) {
      res.status(500).send({ error: 'An error occurred while trying to change the role' })
    }
  }
}

export const getUserByToken = async (req: FastifyRequest, res: FastifyReply) => {
  const authorization = req.headers['authorization']
  if (!authorization) {
    res.status(401).send({ error: 'Not authorized' })
    return
  }
  const token = authorization.replace('Bearer ', '')
  const userInfo = await getUserByTokenAction(token)

  if (!userInfo) {
    res.status(401).send({ error: 'Not authorized' })
    return
  }

  res.send(userInfo)
}

export const buyCourse = async (req: FastifyRequest, res: FastifyReply) => {
  const courseObject = z.object({
    course_id: z.string(),
  })

  const course = courseObject.safeParse(req.body)

  if (!course.success) {
    res.status(400).send({ error: course.error })
  } else {
    const { course_id } = course.data

    const authorization = req.headers['authorization']
    if (!authorization) {
      res.status(401).send({ error: 'Not authorized' })
      return
    }
    const token = authorization.replace('Bearer ', '')
    const userInfo = await getUserByTokenAction(token)

    if (!userInfo) {
      res.status(401).send({ error: 'Not authorized' })
      return
    }

    try {
      await buyCourseAction(token, course_id)
      res.send({ message: 'Course bought successfully' })
    } catch (error) {
      res.status(500).send({ error: 'An error occurred while trying to buy the course' })
    }
  }
}

export const getUserCourses = async (req: FastifyRequest, res: FastifyReply) => {
  const authorization = req.headers['authorization']
  if (!authorization) {
    res.status(401).send({ error: 'Not authorized' })
    return
  }
  const token = authorization.replace('Bearer ', '')
  const userInfo = await getUserByTokenAction(token)

  if (!userInfo) {
    res.status(401).send({ error: 'Not authorized' })
    return
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userInfo.id,
      },
      include: {
        Course: true,
      },
    })

    if (!user) {
      res.status(404).send({ error: 'User not found' })
    }

    res.send(user)
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while trying to get the user' })
  }
}
