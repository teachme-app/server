import { FastifyInstance } from 'fastify'
import {
  changeRoleToTeacher,
  createUser,
  deleteUser,
  getUser,
  loginUser,
  updateUser,
} from './modules/user/controllers/user.controller'
import { authMiddleware } from './modules/user/actions/middlewares/login.middleware'
import { createCourse, getCourses, updateCourse } from './modules/course/controller/course.controller'
import {
  createLesson,
  deleteLesson,
  getLessonsByCourse,
  updateLesson,
} from './modules/lesson/controller/lesson.controller'

const apiURL: string = '/api/v1'

export const appRoutes = async (app: FastifyInstance) => {
  app.post(`${apiURL}/user`, async (req, res) => createUser(req, res))
  app.get(`${apiURL}/user`, { preHandler: [authMiddleware] }, async () => getUser())
  app.patch(`${apiURL}/user`, { preHandler: [authMiddleware] }, async (req, res) => updateUser(req, res))
  app.delete(`${apiURL}/user`, { preHandler: [authMiddleware] }, async (req, res) => deleteUser(req, res))
  app.patch(`${apiURL}/create-teacher`, async (req, res) => changeRoleToTeacher(req, res))

  app.post(`${apiURL}/login`, async (req, res) => loginUser(req, res))

  app.post(`${apiURL}/course`, { preHandler: [authMiddleware] }, async (req, res) => createCourse(req, res))
  app.get(`${apiURL}/course`, { preHandler: [authMiddleware] }, async (req, res) => getCourses(req, res))
  app.patch(`${apiURL}/course`, { preHandler: [authMiddleware] }, async (req, res) => updateCourse(req, res))
  app.delete(`${apiURL}/course`, { preHandler: [authMiddleware] }, async (req, res) => updateCourse(req, res))

  app.post(`${apiURL}/lesson`, { preHandler: [authMiddleware] }, async (req, res) => createLesson(req, res))
  app.patch(`${apiURL}/lesson`, { preHandler: [authMiddleware] }, async (req, res) => updateLesson(req, res))
  app.get(`${apiURL}/lesson/:id`, { preHandler: [authMiddleware] }, async (req, res) =>
    getLessonsByCourse(req, res)
  )
  app.delete(`${apiURL}/lesson/:id`, { preHandler: [authMiddleware] }, async (req, res) =>
    deleteLesson(req, res)
  )
}
