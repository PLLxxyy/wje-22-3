import express from 'express'
import cors from 'cors'
import { db } from './database'
import './init-db'
import authRoutes from './routes/auth'
import propertyRoutes from './routes/properties'
import noteRoutes from './routes/notes'
import reminderRoutes from './routes/reminders'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/reminders', reminderRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
