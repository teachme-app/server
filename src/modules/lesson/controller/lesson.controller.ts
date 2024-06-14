import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import { getUserByToken } from '../../user/actions/user.action'
import { getCourseByIdAction } from '../../course/actions/course.action'

export const createLesson = async (req: FastifyRequest, res: FastifyReply) => {
  const lessonObject = z.object({
    title: z.string(),
    description: z.string(),
    courseId: z.string(),
    videoUrl: z.string(),
  })

  const lesson = lessonObject.safeParse(req.body)

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

  if (!lesson.success) {
    res.code(400).send({ error: lesson.error })
    return
  } else {
    const { title, description, courseId, videoUrl } = lesson.data

    const courseInfo = await getCourseByIdAction(courseId)
    if (!courseInfo || courseInfo.userId !== userInfo.id) {
      res.status(401).send({ error: 'You are not the owner of this course' })
      return
    }

    try {
      await prisma.lesson.create({
        data: {
          title,
          description,
          courseId,
          videoUrl,
        },
      })
      res.send({ message: 'Lesson created successfully' })
    } catch (e) {
      res.status(500).send({ error: 'An error occurred while trying to create the lesson' })
    }
  }
}

export const updateLesson = async (req: FastifyRequest, res: FastifyReply) => {
  const lessonObject = z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    videoUrl: z.string().optional(),
  })

  const lesson = lessonObject.safeParse(req.body)

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

  if (!lesson.success) {
    res.code(400).send({ error: lesson.error })
    return
  } else {
    const { id, title, description, videoUrl } = lesson.data

    const lessonInfo = await prisma.lesson.findUnique({ where: { id } })
    if (!lessonInfo) {
      res.status(404).send({ error: 'Lesson not found' })
      return
    }

    const courseInfo = await getCourseByIdAction(lessonInfo.courseId)
    if (!courseInfo || courseInfo.userId !== userInfo.id) {
      res.status(401).send({ error: 'You are not the owner of this course' })
      return
    }

    try {
      await prisma.lesson.update({
        where: { id },
        data: {
          title,
          description,
          videoUrl,
        },
      })
      res.send({ message: 'Lesson updated successfully' })
    } catch (e) {
      res.status(500).send({ error: 'An error occurred while trying to update the lesson' })
    }
  }
}

export const getLessonsByCourse = async (req: FastifyRequest, res: FastifyReply) => {
  const getLessonsByCourseObject = z.object({
    courseId: z.string().uuid(),
  })

  const courseId = getLessonsByCourseObject.safeParse(req.query)

  if (!courseId.success) {
    res.code(400).send({ error: courseId.error })
    return
  } else {
    const lessons = await prisma.lesson.findMany({
      where: {
        courseId: courseId.data.courseId,
      },
      select: {
        id: true,
        title: true,
        description: true,
      },
    })
    res.send(lessons)
  }
}

export const deleteLesson = async (req: FastifyRequest, res: FastifyReply) => {
  const lessonObject = z.object({
    id: z.string(),
  })

  const lesson = lessonObject.safeParse(req.query)

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

  if (!lesson.success) {
    res.code(400).send({ error: lesson.error })
    return
  } else {
    const { id } = lesson.data

    const lessonInfo = await prisma.lesson.findUnique({ where: { id } })
    if (!lessonInfo) {
      res.status(404).send({ error: 'Lesson not found' })
      return
    }

    const courseInfo = await getCourseByIdAction(lessonInfo.courseId)
    if (!courseInfo || courseInfo.userId !== userInfo.id) {
      res.status(401).send({ error: 'You are not the owner of this course' })
      return
    }

    try {
      await prisma.lesson.delete({
        where: { id },
      })
      res.send({ message: 'Lesson deleted successfully' })
    } catch (e) {
      res.status(500).send({ error: 'An error occurred while trying to delete the lesson' })
    }
  }
}
