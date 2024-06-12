import { prisma } from '../../../lib/prisma'
import { Course } from '../course'

export const createCourseAction = async (course: Course) => {
  const { title, description, price, user_id } = course

  try {
    return await prisma.course.create({
      data: { title, description, price, userId: user_id },
    })
  } catch (error) {
    return { error: error.message }
  }
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
