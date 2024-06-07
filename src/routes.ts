import { FastifyInstance } from 'fastify'
import { createUser, getUser, loginUser } from './modules/controllers/user.controller'
import { authMiddleware } from './modules/actions/login.middleware'

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/api/v1/user', async (req, res) => createUser(req, res))
  app.get('/api/v1/user', { preHandler: [authMiddleware] }, async () => getUser())

  app.post('/api/v1/login', async (req, res) => loginUser(req, res))
}
