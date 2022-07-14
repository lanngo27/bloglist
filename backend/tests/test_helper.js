const User = require('../models/user')
const Blog = require('../models/blog')

const getInitialBlogs = (userId) => {
  return [
    {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user: userId
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      user: userId
    },
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      user: userId
    },
    {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      user: userId
    },
    {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      user: userId
    },
    {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      user: userId
    }
  ]
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'to be removed',
    author: 'to be removed',
    url: 'to be removed',
    likes: 0
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createTestUser = async (api) => {
  const testUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testtest'
  }

  await api
    .post('/api/users')
    .send(testUser)
  const createdUser = await User.findOne(testUser)

  const result = await api
    .post('/api/login')
    .send(testUser)

  return [ createdUser._id.toString(), result.body.token ]
}

module.exports = {
  getInitialBlogs, nonExistingId, blogsInDb, usersInDb, createTestUser
}