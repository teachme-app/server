import fastify from 'fastify'
import { appRoutes } from './routes'
import z from 'zod'
const app = fastify()
import cors from '@fastify/cors'

app.register(cors, {
  origin: '*',
  methods: ['POST', 'GET', 'DELETE', 'PATCH'],
})

const PORT = process.env.PORT || 3000

app.register(appRoutes)

app.listen({ port: 3000 }, (err) => {
  console.log(`SERVIDOR RODANDO`)
  console.log(`----------------`)
  console.log(`PORTA: ${PORT}`)
  console.log(`URL: http://localhost:${PORT}`)
  console.log(`API URL: /api/v1`)
  console.log(`----------------`)
})
