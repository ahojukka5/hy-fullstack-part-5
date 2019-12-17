const request = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  const data = require('./testdata')
  await Blog.deleteMany({})
  await User.deleteMany({})
  await Blog.insertMany(data.blogs)
  await User.insertMany(data.users)
})

describe('usersRouter', () => {
  test('returns all users with HTTP GET to /api/users', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const testdata = require('./testdata').users
    expect(response.body.length).toBe(testdata.length)
  })

  test('adds new user with HTTP POST to /api/users', async () => {
    const userCountBefore = await User.countDocuments({})
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'John Doe',
        username: 'john',
        password: 'secret'
      })
      .expect(200)
    const user = await User.findById(response.body.id)
    const userCountAfter = await User.countDocuments({})
    expect(userCountAfter).toBe(userCountBefore + 1)
    expect(user.name).toBe('John Doe')
    expect(user.passwordHash).not.toBe('secret')
  })

  test('takes care that username must be at least 3 characters long', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John Doe', username: 'jo', password: 'secret' })
      .expect(400)
    expect(response.body.error).toEqual(
      'User validation failed: username: Path `username` (`jo`) ' +
        'is shorter than the minimum allowed length (3).'
    )
  })

  test('takes care that username must be unique', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Test User', username: 'test', password: 'secret' })
      .expect(400)
    expect(response.body.error).toEqual(
      'User validation failed: username: Error, expected ' +
        '`username` to be unique. Value: `test`'
    )
  })

  test('takes care that password must be at least 3 characters long', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John Doe', username: 'john', password: 'p' })
      .expect(400)
    expect(response.body.error).toEqual(
      'User validation failed: username: Path `password` is shorter ' +
        'than the minimum allowed length (3).'
    )
  })
})

afterAll(() => {
  const mongoose = require('mongoose')
  mongoose.connection.close()
})
