require('express-async-errors')
const cors = require('cors')

import express, { Application } from 'express'
import mongoose from 'mongoose'
import blogsRouter from './routes/blogs'
import usersRouter from './routes/users'
import loginRouter from './routes/login'
import testRouter from './routes/testing'
import logger from './utils/logger'
import config from './utils/config'
import middleware from './utils/middleware'
import path from 'path'

const app: Application = express()

const mongoUrl: string = config.MONGODB_URI
logger.info('connecting to ', mongoUrl)
mongoose
  .connect(mongoUrl)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message)
  })

app.use(express.json())

app.use(cors())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use(express.static('frontend/build'))

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (config.NODE_ENV === 'test') {
  app.use('/api/testing', testRouter)
}

app.get('/*', function (_req, res) {
  res.sendFile(
    path.join(__dirname, '../frontend/build/index.html'),
    function (err) {
      if (err) {
        res.status(500).send(err)
      }
    }
  )
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
