import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import healthRoutes from './routes/healthRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import sessionRoutes from './routes/sessionRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import { requestLogger } from './middleware/requestLogger.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const swaggerDocument = YAML.load(join(__dirname, '../docs/swagger.yaml'))

const app = express()

app.use(cors())
app.use(requestLogger)
app.use(express.json())

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/api', healthRoutes)
app.use('/api', courseRoutes)
app.use('/api', sessionRoutes)
app.use('/api', eventRoutes)
app.use('/api/analytics', analyticsRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
