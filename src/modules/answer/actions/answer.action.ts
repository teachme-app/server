import { prisma } from '../../../lib/prisma'
import { Answer } from '../answer'

export const createAnswerAction = async (answer: Answer) => {
  try {
    await prisma.answer.create({
      data: answer,
    })
  } catch (error) {
    return { error: error.message }
  }
}

export const getAnswerById = async (id: string) => {
  return await prisma.answer.findUnique({
    where: { id },
  })
}
