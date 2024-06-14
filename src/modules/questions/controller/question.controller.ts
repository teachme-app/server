import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { createQuestionAction } from '../actions/question.action'
import { getUserByToken } from '../../user/actions/user.action'
import { getLessonById } from '../../lesson/actions/lesson.action'
import { getCourseByIdAction } from '../../course/actions/course.action'
import { prisma } from '../../../lib/prisma'

export const createQuestion = async (req: FastifyRequest, res: FastifyReply) => {
  const createQuestionObject = z.object({
    title: z.string(),
    description: z.string(),
    lessonId: z.string(),
  })

  const question = createQuestionObject.safeParse(req.body)

  if (!question.success) {
    return res.status(400).send({ error: question.error })
  } else {
    const { title, description, lessonId } = question.data

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

    const lessonInfo = await getLessonById(lessonId)
    if (!lessonInfo) {
      res.status(404).send({ error: 'Lesson not found' })
      return
    }

    try {
      await createQuestionAction({ title, description, lessonId, userId: userInfo.id })
      return res.send({ message: 'Question created successfully' })
    } catch (e) {
      return res.status(500).send({ error: 'An error occurred while trying to create the question' })
    }
  }
}

export const getQuestionsByLesson = async (req: FastifyRequest, res: FastifyReply) => {
  const getQuestionsObject = z.object({
    lessonId: z.string(),
  })

  const questions = getQuestionsObject.safeParse(req.query)

  if (!questions.success) {
    return res.status(400).send({ error: questions.error })
  } else {
    const { lessonId } = questions.data

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

    const lessonInfo = await getLessonById(lessonId)
    if (!lessonInfo) {
      res.status(404).send({ error: 'Lesson not found' })
      return
    }

    return await prisma.question.findMany({
      where: { lessonId },
    })
  }
}

export const deleteQuestion = async (req: FastifyRequest, res: FastifyReply) => {
  const deleteQuestionObject = z.object({
    id: z.string(),
  })

  const question = deleteQuestionObject.safeParse(req.query)

  if (!question.success) {
    return res.status(400).send({ error: question.error })
  } else {
    const { id } = question.data

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

    const questionInfo = await prisma.question.findUnique({ where: { id } })
    if (!questionInfo) {
      res.status(404).send({ error: 'Question not found' })
      return
    }

    if (!questionInfo || userInfo.id !== questionInfo.userId) {
      res.status(401).send({ error: 'You are not the owner of this question' })
      return
    }

    try {
      await prisma.question.delete({ where: { id } })
      return res.send({ message: 'Question deleted successfully' })
    } catch (e) {
      return res.status(500).send({ error: 'An error occurred while trying to delete the question' })
    }
  }
}
