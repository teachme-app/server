import fastify from 'fastify'
import { appRoutes } from './routes'
import z from 'zod'
const app = fastify()

const PORT = process.env.PORT || 3000

app.register(appRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
