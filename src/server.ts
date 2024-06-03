import fastify from 'fastify'
import { appRoutes } from './routes'
import z from 'zod'
const app = fastify()

const PORT = process.env.PORT || 3000

app.register(appRoutes)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof z.ZodError) {
    // If the error is a Zod validation error, respond with a 400 status code and the error messages
    app.setErrorHandler((error, request, reply) => {
      if (error instanceof z.ZodError) {
        // If the error is a Zod validation error, respond with a 400 status code and the error messages
        reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: error.errors.map((err) => err.message).join(', '),
        })
      } else {
        // If it's not a Zod validation error, let Fastify handle it
        reply.send(error)
      }
    })
  } else {
    // If it's not a Zod validation error, let Fastify handle it
    reply.send(error)
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
