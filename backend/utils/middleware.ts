import logger from './logger'
import User from '../models/user'
import { Request, Response, NextFunction } from 'express'
const jwt = require('jsonwebtoken')

const requestLogger = (
  request: Request,
  _response: Response,
  next: NextFunction
) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (_request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (
  error: any,
  _request: Request,
  response: Response,
  next: NextFunction
) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  return next(error)
}

const tokenExtractor = (
  request: Request,
  _response: Response,
  next: NextFunction
) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

const userExtractor = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    response.status(400).json({
      error: 'token missing or invalid'
    })
  }

  const user = await User.findById(decodedToken.id)
  if (user) {
    request.user = user
  }

  next()
}

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}
