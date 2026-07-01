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
import analyticsV2Routes from './routes/analyticsV2Routes.js'
import { registerPhase2AnalyticsModules } from './analytics/registerPhase2Modules.js'
import authRoutes from './routes/authRoutes.js'
import progressRoutes from './routes/progressRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import certificateRoutes from './routes/certificateRoutes.js'
import { requestLogger } from './middleware/requestLogger.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const swaggerDocument = YAML.load(join(__dirname, '../docs/swagger.yaml'))

registerPhase2AnalyticsModules()

const app = express()

// Serve static files from the public directory
app.use(express.static(join(__dirname, '../public')))

app.use(cors())
app.use(requestLogger)
app.use(express.json())

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/api', healthRoutes)
app.use('/api', courseRoutes)
app.use('/api', sessionRoutes)
app.use('/api', eventRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/v2/analytics', analyticsV2Routes)
app.use('/api/auth', authRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api/certificates', certificateRoutes)

// Error Handling Middleware
app.use(notFound)
app.use(errorHandler)

export default app
