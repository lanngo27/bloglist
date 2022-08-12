const bcrypt = require('bcrypt')
import request from 'supertest'
import mongoose from 'mongoose'
import helper from '../utils/test_helper'
import app from '../app'
import User, { IUser } from '../models/user'
import { NewUser, UserJSON } from '../typings/types'

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash: string = await bcrypt.hash('sekret', 10)
    const user: IUser = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart: UserJSON[] = await helper.usersInDb()

    const newUser: NewUser = {
      username: 'lanngo2',
      name: 'Lan Ngo',
      password: 'ngo123'
    }

    await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd: UserJSON[] = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames: string[] = usersAtEnd.map((user) => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart: UserJSON[] = await helper.usersInDb()

    const newUser: NewUser = {
      username: 'root',
      name: 'root user',
      password: 'ngo123'
    }

    const result = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('Username must be unique')

    const usersAtEnd: UserJSON[] = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if password is not given', async () => {
    const usersAtStart: UserJSON[] = await helper.usersInDb()

    const newUser: NewUser = {
      username: 'lanngo',
      name: 'Lan Ngo'
    }

    const result = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain(
      'Password must be given with length at least 3 characters long'
    )

    const usersAtEnd: UserJSON[] = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if password is less than 3 characters long', async () => {
    const usersAtStart: UserJSON[] = await helper.usersInDb()

    const newUser: NewUser = {
      username: 'lanngo',
      name: 'Lan Ngo',
      password: 'ng'
    }

    const result = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain(
      'Password must be given with length at least 3 characters long'
    )

    const usersAtEnd: UserJSON[] = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
