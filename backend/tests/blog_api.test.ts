import request from 'supertest'
import helper from '../utils/test_helper'
import app from '../app'

import { TestingBlog, Header, BlogJSON } from '../typings/types'

import Blog, { IBlog } from '../models/blog'
import User from '../models/user'

let headers: Header
let initialBlogs: TestingBlog[]
beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const [userId, token] = await helper.createTestUser(request(app))
  initialBlogs = helper.getInitialBlogs(userId)
  await Blog.insertMany(initialBlogs)

  headers = {
    Authorization: `bearer ${token}`
  }
})

describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await request(app)
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await request(app).get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await request(app).get('/api/blogs')

    const titles: string[] = response.body.map((b: IBlog) => b.title)

    expect(titles).toContain('Go To Statement Considered Harmful')
  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const blogs: IBlog[] = await Blog.find({})
    expect(blogs[0].id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog: TestingBlog = {
      title: 'React basic',
      author: 'Samantha Loken',
      url: 'https://reactbasic.com/',
      likes: 2
    }

    await request(app)
      .post('/api/blogs')
      .set(headers)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd: BlogJSON[] = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

    const createdBlog: BlogJSON = blogsAtEnd[initialBlogs.length]
    expect({
      title: createdBlog.title,
      author: createdBlog.author,
      url: createdBlog.url,
      likes: createdBlog.likes
    }).toEqual(newBlog)
  })

  test('property likes will default to the value 0 if missing from the request', async () => {
    const newBlog = {
      title: 'React basic 2',
      author: 'Samantha Loken',
      url: 'https://reactbasic2.com/'
    }

    await request(app)
      .post('/api/blogs')
      .set(headers)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd: BlogJSON[] = await helper.blogsInDb()
    expect(blogsAtEnd[initialBlogs.length].likes).toBe(0)
  })

  test('fails with status code 400 if title is missing', async () => {
    const newBlog = {
      author: 'Samantha Loken',
      url: 'https://reactbasic2.com/',
      likes: 1
    }

    await request(app).post('/api/blogs').set(headers).send(newBlog).expect(400)

    const blogsAtEnd: BlogJSON[] = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })

  test('fails with status code 400 if author is missing', async () => {
    const newBlog = {
      title: 'React basic 2',
      url: 'https://reactbasic2.com/',
      likes: 1
    }

    await request(app).post('/api/blogs').set(headers).send(newBlog).expect(400)

    const blogsAtEnd: BlogJSON[] = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })

  test('fails with status code 401 if token is missing', async () => {
    const newBlog = {
      title: 'React basic 2',
      url: 'https://reactbasic2.com/',
      likes: 1
    }

    await request(app).post('/api/blogs').send(newBlog).expect(401)

    const blogsAtEnd: BlogJSON[] = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogAtStart: BlogJSON[] = await helper.blogsInDb()
    const blogToDelete: BlogJSON = blogAtStart[0]

    await request(app)
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set(headers)
      .expect(204)

    const blogsAtEnd: BlogJSON[] = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)
  })
})

describe('updating a blog', () => {
  test('succeeds with valid data', async () => {
    const blogAtStart: BlogJSON[] = await helper.blogsInDb()
    const blogToUpdate: BlogJSON = blogAtStart[0]

    const updatedBlog = {
      title: 'React basic',
      author: 'Samantha Loken',
      url: 'https://reactbasic.com/',
      likes: 2
    }

    await request(app)
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd: BlogJSON[] = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)

    const updatedBlogAtEnd: BlogJSON = blogsAtEnd[0]
    expect({
      title: updatedBlogAtEnd.title,
      author: updatedBlogAtEnd.author,
      url: updatedBlogAtEnd.url,
      likes: updatedBlogAtEnd.likes
    }).toEqual(updatedBlog)
  })
})
