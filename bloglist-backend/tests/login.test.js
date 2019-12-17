const request = require('supertest')
const app = require('../app')

describe('loginRouter', () => {
  test('returns name, username and token when username/password match', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'test', password: 'secret' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.username).toBe('test')
    expect(response.body.token).toBeDefined()
  })

  test('returns code 401, unauthorized access, if given wrong username/password', async () => {
    await request(app)
      .post('/api/login')
      .send({ username: 'test', password: 'idontknow' })
      .expect(401)
  })
})

afterAll(() => {
  const mongoose = require('mongoose')
  mongoose.connection.close()
})
