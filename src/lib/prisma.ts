import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
})

prisma.$use(async (params, next) => {
  if (params.model === 'User' && (params.action === 'create' || params.action === 'update')) {
    const data = params.args.data

    if (data.role === 'TEACHER' && !data.graduation) {
      throw new Error('Field formation is required for teachers')
    }
  }
  return next(params)
})
