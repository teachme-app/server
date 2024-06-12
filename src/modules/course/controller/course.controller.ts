import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { createCourseAction } from '../actions/course.action'

export const createCourse = (req: FastifyRequest, res: FastifyReply) => {
  const courseObject = z.object({
    title: z.string().max(20),
    description: z.string().max(150),
    price: z.number(),
    user_id: z.string().uuid(),
  })

  const course = courseObject.safeParse(req.body)

  if (!course.success) {
    res.code(400).send({ error: course.error })
    return
  } else {
    const { title, description, price, user_id } = course.data

    return createCourseAction({ title, description, price, user_id })
  }
}
