import express from 'express'
import Blog from '../models/blog'
import User from '../models/user'

const router = express.Router()

router.post('/reset', async (_request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

export default router
