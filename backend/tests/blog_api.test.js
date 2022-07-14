const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let headers
let initialBlogs
beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const [ userId, token ] = await helper.createTestUser(api)
  initialBlogs = helper.getInitialBlogs(userId)
  await Blog.insertMany(initialBlogs)

  headers = {
    'Authorization': `bearer ${token}`
  }
})

describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(b => b.title)

    expect(titles).toContain('Go To Statement Considered Harmful')
  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const blogs = await Blog.find({})
    expect(blogs[0].id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'React basic',
      author: 'Samantha Loken',
      url: 'https://reactbasic.com/',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set(headers)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

    const createdBlog = blogsAtEnd[initialBlogs.length]
    expect({
      title: createdBlog.title,
      author: createdBlog.author,
      url: createdBlog.url,
      likes: createdBlog.likes
    }).toEqual(newBlog)
  })

  test('property likes will default to the value 0 if missing from the request',
    async () => {
      const newBlog = {
        title: 'React basic 2',
        author: 'Samantha Loken',
        url: 'https://reactbasic2.com/'
      }

      await api
        .post('/api/blogs')
        .set(headers)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd[initialBlogs.length].likes).toBe(0)
    }
  )

  test('fails with status code 400 if title is missing', async () => {
    const newBlog = {
      author: 'Samantha Loken',
      url: 'https://reactbasic2.com/',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .set(headers)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })

  test('fails with status code 400 if author is missing', async () => {
    const newBlog = {
      title: 'React basic 2',
      url: 'https://reactbasic2.com/',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .set(headers)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })

  test('fails with status code 401 if token is missing', async () => {
    const newBlog = {
      title: 'React basic 2',
      url: 'https://reactbasic2.com/',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogAtStart = await helper.blogsInDb()
    const blogToDelete = blogAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set(headers)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)
  })
})


describe('updating a blog', () => {
  test('succeeds with valid data', async () => {
    const blogAtStart = await helper.blogsInDb()
    const blogToUpdate = blogAtStart[0]

    const updatedBlog = {
      title: 'React basic',
      author: 'Samantha Loken',
      url: 'https://reactbasic.com/',
      likes: 2
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)

    const updatedBlogAtEnd = blogsAtEnd[0]
    expect({
      title: updatedBlogAtEnd.title,
      author: updatedBlogAtEnd.author,
      url: updatedBlogAtEnd.url,
      likes: updatedBlogAtEnd.likes
    }).toEqual(updatedBlog)
  })
})