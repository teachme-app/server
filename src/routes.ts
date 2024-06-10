import { FastifyInstance } from 'fastify'
import { createUser, deleteUser, getUser, loginUser, updateUser } from './modules/controllers/user.controller'
import { authMiddleware } from './modules/actions/middlewares/login.middleware'
import { userMiddleware } from './modules/actions/middlewares/user.middleware'

const apiURL: string = '/api/v1'

export const appRoutes = async (app: FastifyInstance) => {
  app.post(`${apiURL}/user`, async (req, res) => createUser(req, res))
  app.get(`${apiURL}/user`, { preHandler: [authMiddleware] }, async () => getUser())
  app.patch(`${apiURL}/user`, { preHandler: [authMiddleware] }, async (req, res) => updateUser(req, res))
  app.delete(`${apiURL}/user`, { preHandler: [authMiddleware] }, async (req, res) => deleteUser(req, res))

  app.post(`${apiURL}/login`, async (req, res) => loginUser(req, res))
}
