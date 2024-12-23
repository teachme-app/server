import { prisma } from '../../../lib/prisma'
import { Course } from '../course'

export const createCourseAction = async (course: Course) => {
  const { title, description, price, user_id, banner } = course

  try {
    return await prisma.course.create({
      data: { title, description, price, userId: user_id, banner },
    })
  } catch (error) {
    return { error: error.message }
  }
}

export const getCourseByIdAction = async (id: string) => {
  return await prisma.course.findUnique({ where: { id } })
}

export const updateCourseAction = async (id: string, course) => {
  const { title, description, price } = course

  try {
    return await prisma.course.update({
      where: { id },
      data: { title, description, price },
    })
  } catch (error) {
    return { error: error.message }
  }
}
