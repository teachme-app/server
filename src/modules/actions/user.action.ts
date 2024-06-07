import { prisma } from '../../lib/prisma'
import { User } from '../types/user'

export const createUserAction = async (user: User) => {
  const { email, name, document, password_hash, birth_date, phone, adress } = user

  try {
    return await prisma.user.create({
      data: { email, name, document, password_hash, birth_date, phone, adress },
    })
  } catch (error) {
    return { error: error.message }
  }
}

export const updateUserAction = async (id: string, user) => {
  const { email, name, document, password_hash, birth_date, phone, adress } = user

  try {
    return await prisma.user.update({
      where: { id },
      data: { email, name, document, password_hash, birth_date, phone, adress },
    })
  } catch (error) {
    return { error: error.message }
  }
}

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } })
}
