import express from 'express'
import User, { IUser } from '../models/user'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const loginRouter = express.Router()

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user: IUser | null = await User.findOne({ username })
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token: string = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60
  })

  return response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

export default loginRouter
