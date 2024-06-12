import { prisma } from '../../../lib/prisma'
import { User } from '../user'
import jwt from 'jsonwebtoken'

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
  const { email, name, document, birth_date, phone, adress } = user

  try {
    return await prisma.user.update({
      where: { id },
      data: { email, name, document, birth_date, phone, adress },
    })
  } catch (error) {
    return { error: error.message }
  }
}

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } })
}

export const getUserByToken = async (token: string) => {
  const { user_id } = jwt.verify(
    token,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZTA4ZTU1ODUtZjRjMi00ODRjLThhNzAtM2MzNGNlNWQyODkzIiwiaWF0IjoxNzE3NzczMTM0fQ.y3C12gPPFo8AOkDEUsH1Hdof7auwMNBYux3wwLMBhz8'
  ) as {
    user_id: string
  }

  const user = await prisma.user.findUnique({ where: { id: user_id } })

  return user
}

export const deleteUserAction = async (id: string) => {
  try {
    return await prisma.user.delete({ where: { id } })
  } catch (error) {
    return { error: error.message }
  }
}
