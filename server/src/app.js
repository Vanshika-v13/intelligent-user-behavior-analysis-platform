import express from 'express'
import cors from 'cors'
import healthRoutes from './routes/healthRoutes.js'
import sessionRoutes from './routes/sessionRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import { requestLogger } from './middleware/requestLogger.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors())
app.use(requestLogger)
app.use(express.json())

app.use('/api', healthRoutes)
app.use('/api', sessionRoutes)
app.use('/api', eventRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
