const express = require('express')
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const path = require('path')

const app = express()

const mongoUrl = config.MONGODB_URI
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

if (process.env.NODE_ENV === 'test') {
  const testRouter = require('./controllers/testing')
  app.use('/api/testing', testRouter)
}

app.get('/*', function (req, res) {
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

module.exports = app
