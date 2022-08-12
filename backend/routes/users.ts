import express from 'express'
import User, { IUser } from '../models/user'
const bcrypt = require('bcrypt')

const usersRouter = express.Router()

usersRouter.get('/', async (_request, response) => {
  const users: IUser[] = await User.find({}).populate('blogs')
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!(password && password.length >= 3)) {
    return response.status(400).json({
      error: 'Password must be given with length at least 3 characters long'
    })
  }

  const existingUser: IUser | null = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'Username must be unique'
    })
  }

  const saltRounds = 10
  const passwordHash: string = await bcrypt.hash(password, saltRounds)

  const user: IUser = new User({
    username,
    name,
    passwordHash
  })

  const savedUser: IUser = await user.save()

  return response.status(201).json(savedUser)
})

export default usersRouter
