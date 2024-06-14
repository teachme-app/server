import { Lesson } from '@prisma/client'
import { prisma } from '../../../lib/prisma'

export const createLessonAction = async (lesson: Lesson) => {
  try {
    await prisma.lesson.create({
      data: lesson,
    })
  } catch (error) {
    return { error: error.message }
  }
}

export const updateLessonAction = async (lesson: Lesson) => {
  try {
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: lesson,
    })
  } catch (error) {
    return { error: error.message }
  }
}

export const getLessonById = async (id: string) => {
  return await prisma.lesson.findUnique({
    where: { id },
    include: {
      questions: true,
    },
  })
}
