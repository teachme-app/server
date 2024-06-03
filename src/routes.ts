import { FastifyInstance } from 'fastify'
import { createUser, getUser } from './modules/controllers/user.controller'

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/api/v1/user', async (req, res) => createUser(req, res))
  app.get('/api/v1/user', async () => getUser())
}
