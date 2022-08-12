import express from 'express'
import middleware from '../utils/middleware'
import Blog, { IBlog } from '../models/blog'

const blogRouter = express.Router()

blogRouter.get('/', async (_request, response) => {
  const blogs: IBlog[] = await Blog.find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
    comments: body.comments
  })

  const savedBlog: IBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user

    const blog: IBlog | null = await Blog.findById(request.params.id)

    if (blog) {
      if (user._id.toString() !== blog.user.toString()) {
        return response.status(403).json({
          error: 'User is not authorized to delete this blog'
        })
      }
      await Blog.deleteOne({ title: blog.title })
      return response.status(204).end()
    } else {
      return response.sendStatus(404)
    }
  }
)

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog: IBlog | null = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      comments: body.comments
    },
    { new: true, runValidators: true, context: 'query' }
  ).populate('user')

  response.json(updatedBlog)
})

blogRouter.post('/:id/comments', async (request, response) => {
  if (request.body.comment) {
    const updatedBlog: IBlog | null = await Blog.findByIdAndUpdate(
      request.params.id,
      { $push: { comments: request.body.comment } },
      { new: true }
    ).populate('user')
    response.json(updatedBlog)
  } else {
    response.status(400).send({ error: 'Comment is missing' })
  }
})

export default blogRouter
