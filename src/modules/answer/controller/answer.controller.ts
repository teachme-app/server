import { FastifyReply, FastifyRequest } from 'fastify'
import { getUserByToken } from '../../user/actions/user.action'
import { createAnswerAction, getAnswerById } from '../actions/answer.action'
import { z } from 'zod'
import { getQuestionById } from '../../questions/actions/question.action'
import { prisma } from '../../../lib/prisma'

export const createAnswer = async (req: FastifyRequest, res: FastifyReply) => {
  const createQuestionObject = z.object({
    title: z.string(),
    description: z.string(),
    questionId: z.string(),
  })

  const answer = createQuestionObject.safeParse(req.body)

  if (!answer.success) {
    return res.status(400).send({ error: answer.error })
  } else {
    const { title, description, questionId } = answer.data

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

    const questionInfo = await getQuestionById(questionId)
    if (!questionInfo) {
      res.status(404).send({ error: 'Question not found' })
      return
    }

    try {
      await createAnswerAction({ title, description, questionId, userId: userInfo.id })
      return res.send({ message: 'Answer created successfully' })
    } catch (e) {
      return res.status(500).send({ error: 'An error occurred while trying to create the question' })
    }
  }
}

export const deleteAnswer = async (req: FastifyRequest, res: FastifyReply) => {
  const deleteAnswerObject = z.object({
    id: z.string(),
  })

  const answer = deleteAnswerObject.safeParse(req.query)

  if (!answer.success) {
    return res.status(400).send({ error: answer.error })
  } else {
    const { id } = answer.data

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

    const answerInfo = await getAnswerById(id)
    if (!answerInfo) {
      res.status(404).send({ error: 'Answer not found' })
      return
    }

    if (answerInfo.userId !== userInfo.id) {
      res.status(401).send({ error: 'You are not the owner of this answer' })
      return
    }

    try {
      await prisma.answer.delete({ where: { id } })
      return res.send({ message: 'Answer deleted successfully' })
    } catch (e) {
      return res.status(500).send({ error: 'An error occurred while trying to delete the answer' })
    }
  }
}
