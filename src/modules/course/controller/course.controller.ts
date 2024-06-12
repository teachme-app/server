import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { createCourseAction, updateCourseAction } from '../actions/course.action'
import { getUserByToken } from '../../user/actions/user.action'
import { prisma } from '../../../lib/prisma'

export const createCourse = async (req: FastifyRequest, res: FastifyReply) => {
  const courseObject = z.object({
    title: z.string().max(20),
    description: z.string().max(150),
    price: z.number(),
  })

  const course = courseObject.safeParse(req.body)

  if (!course.success) {
    res.code(400).send({ error: course.error })
    return
  } else {
    const { title, description, price } = course.data

    const authorization = req.headers['authorization']
    if (!authorization) {
      res.status(401).send({ error: 'Not authorized' })
      return
    }
    const token = authorization.replace('Bearer ', '')
    const userInfo = await getUserByToken(token)

    if (!userInfo) {
      res.status(401).send({ error: 'Not authorized' })
      return
    }

    try {
      await createCourseAction({ title, description, price, user_id: userInfo.id })
      res.send({ message: 'Course created successfully' })
    } catch (e) {
      res.status(500).send({ error: 'An error occurred while trying to create the course' })
    }
  }
}

export const getCourses = async (req: FastifyRequest, res: FastifyReply) => {
  return await prisma.course.findMany()
}

export const updateCourse = async (req: FastifyRequest, res: FastifyReply) => {
  const courseObject = z.object({
    id: z.string(),
    title: z.string().max(20).optional(),
    description: z.string().max(150).optional(),
    price: z.number().optional(),
  })

  const course = courseObject.safeParse(req.body)

  if (!course.success) {
    res.code(400).send({ error: course.error })
    return
  } else {
    const { id, title, description, price } = course.data

    try {
      await updateCourseAction(id, { title, description, price })
      res.send({ message: 'Course updated successfully' })
    } catch (e) {
      res.status(500).send({ error: 'An error occurred while trying to update the course' })
    }
  }
}
