import { Question } from '../question'
import { prisma } from '../../../lib/prisma'

export const createQuestionAction = async (question: Question) => {
  try {
    await prisma.question.create({
      data: question,
    })
  } catch (error) {
    return { error: error.message }
  }
}

export const getQuestionById = async (id: string) => {
  return await prisma.question.findUnique({
    where: { id },
  })
}
