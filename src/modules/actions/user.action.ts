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
