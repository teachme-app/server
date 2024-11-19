import { FastifyInstance } from 'fastify'
import {
  buyCourse,
  changeRoleToTeacher,
  createUser,
  deleteUser,
  getUser,
  getUserByEmail,
  getUserById,
  getUserByToken,
  getUserCourses,
  loginUser,
  updateUser,
} from './modules/user/controllers/user.controller'
import { authMiddleware } from './modules/user/actions/middlewares/login.middleware'
import {
  createCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
} from './modules/course/controller/course.controller'
import {
  createLesson,
  deleteLesson,
  getLessonsByCourse,
  updateLesson,
} from './modules/lesson/controller/lesson.controller'
import {
  createQuestion,
  deleteQuestion,
  getQuestionsByLesson,
} from './modules/questions/controller/question.controller'
import { createAnswer, deleteAnswer } from './modules/answer/controller/answer.controller'

const apiURL: string = '/api/v1'

export const appRoutes = async (app: FastifyInstance) => {
  app.post(`${apiURL}/user`, async (req, res) => createUser(req, res))
  app.get(`${apiURL}/user`, { preHandler: [authMiddleware] }, async () => getUser())
  app.get(`${apiURL}/user-token`, { preHandler: [authMiddleware] }, async (req, res) =>
    getUserByToken(req, res)
  )
  app.post(`${apiURL}/user-email`, { preHandler: [authMiddleware] }, async (req, res) =>
    getUserByEmail(req, res)
  )
  app.get(`${apiURL}/user/:id`, { preHandler: [authMiddleware] }, async (req, res) => getUserById(req, res))
  app.patch(`${apiURL}/user`, { preHandler: [authMiddleware] }, async (req, res) => updateUser(req, res))
  app.delete(`${apiURL}/user`, { preHandler: [authMiddleware] }, async (req, res) => deleteUser(req, res))
  app.patch(`${apiURL}/create-teacher`, { preHandler: [authMiddleware] }, async (req, res) =>
    changeRoleToTeacher(req, res)
  )
  app.get(`${apiURL}/user-courses`, { preHandler: [authMiddleware] }, async (req, res) =>
    getUserCourses(req, res)
  )

  app.post(`${apiURL}/login`, async (req, res) => loginUser(req, res))

  app.post(`${apiURL}/course`, { preHandler: [authMiddleware] }, async (req, res) => createCourse(req, res))
  app.get(`${apiURL}/course`, { preHandler: [authMiddleware] }, async (req, res) => getCourses(req, res))
  app.get(`${apiURL}/course/:id`, { preHandler: [authMiddleware] }, async (req, res) => getCourse(req, res))
  app.patch(`${apiURL}/course`, { preHandler: [authMiddleware] }, async (req, res) => updateCourse(req, res))
  app.delete(`${apiURL}/course/:id`, { preHandler: [authMiddleware] }, async (req, res) =>
    deleteCourse(req, res)
  )
  app.post(`${apiURL}/buy-course`, { preHandler: [authMiddleware] }, async (req, res) => buyCourse(req, res))

  app.post(`${apiURL}/lesson`, { preHandler: [authMiddleware] }, async (req, res) => createLesson(req, res))
  app.patch(`${apiURL}/lesson`, { preHandler: [authMiddleware] }, async (req, res) => updateLesson(req, res))
  app.get(`${apiURL}/lesson/:id`, { preHandler: [authMiddleware] }, async (req, res) =>
    getLessonsByCourse(req, res)
  )
  app.delete(`${apiURL}/lesson/:id`, { preHandler: [authMiddleware] }, async (req, res) =>
    deleteLesson(req, res)
  )

  app.post(`${apiURL}/question`, { preHandler: [authMiddleware] }, async (req, res) =>
    createQuestion(req, res)
  )
  app.get(`${apiURL}/question/:id`, { preHandler: [authMiddleware] }, async (req, res) =>
    getQuestionsByLesson(req, res)
  )
  app.delete(`${apiURL}/question/:id`, { preHandler: [authMiddleware] }, async (req, res) =>
    deleteQuestion(req, res)
  )

  app.post(`${apiURL}/answer`, { preHandler: [authMiddleware] }, async (req, res) => createAnswer(req, res))
  app.delete(`${apiURL}/answer/:id`, { preHandler: [authMiddleware] }, async (req, res) =>
    deleteAnswer(req, res)
  )
}
