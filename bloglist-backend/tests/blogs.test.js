const request = require('supertest')
const app = require('../app')
const logger = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  const data = require('./testdata')
  await Blog.deleteMany({})
  await User.deleteMany({})
  await Blog.insertMany(data.blogs)
  await User.insertMany(data.users)
})

describe('blogsRouter', () => {
  test('returns all blog posts with HTTP GET to /api/blogs', async () => {
    const response = await request(app)
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.length).toBe(6)
  })

  test('modifies blog documents to that each blog post has `id` defined', async () => {
    const blogs = await request(app)
      .get('/api/blogs')
      .expect(200)
    expect(blogs.body[0].id).toBeDefined()
  })

  test('does not accept addition of new blogs posts for unauthenticated users', async () => {
    await request(app)
      .post('/api/blogs')
      .send({
        title: 'Whos is John Doe anyway?',
        author: 'John Doe',
        url: 'https://en.wikipedia.org/wiki/John_doe'
      })
      .expect(401)
  })

  test('adds new blog post with HTTP POST to /api/blogs', async () => {
    const loginResponse = await request(app)
      .post('/api/login')
      .send({ username: 'test', password: 'secret' })
      .expect(200)
    const data = {
      title: 'Who is John Doe anyway?',
      author: 'John Doe',
      url: 'https://en.wikipedia.org/wiki/John_Doe'
    }
    const numberOfBlogsBefore = await Blog.countDocuments({})
    const response = await request(app)
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + loginResponse.body.token)
      .send(data)
      .expect(201)
    const blog = await Blog.findById(response.body.id)
    const numberOfBlogsAfter = await Blog.countDocuments({})
    expect(numberOfBlogsAfter).toBe(numberOfBlogsBefore + 1)
    expect(blog.title).toBe(data.title)
    expect(blog.author).toBe(data.author)
    expect(blog.url).toBe(data.url)
    expect(blog.user.toString()).toBe('5db6f7ac3826a24ba8a35926')
    const user = await User.findOne({})
    expect(user.blogs[user.blogs.length - 1].toString()).toBe(blog.id)
  })

  test(
    'adds `likes: 0` to new blog post, if not given during ' +
      'HTTP POST to /api/blogs',
    async () => {
      const loginResponse = await request(app)
        .post('/api/login')
        .send({ username: 'test', password: 'secret' })
        .expect(200)
      const data = {
        title: 'Who is John Doe anyway?',
        author: 'John Doe',
        url: 'https://en.wikipedia.org/wiki/John_Doe'
      }
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + loginResponse.body.token)
        .send(data)
        .expect(201)
      expect(response.body.likes).toBeDefined()
    }
  )

  test(
    'requires that `title` and `url` must be defined ' +
      'in all new blog posts',
    async () => {
      const loginResponse = await request(app)
        .post('/api/login')
        .send({ username: 'test', password: 'secret' })
        .expect(200)
      const response1 = await request(app)
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + loginResponse.body.token)
        .send({ author: 'John Doe' })
        .expect(400)
      const response2 = await request(app)
        .post('/api/blogs')
        .set('Authorization', 'Bearer ' + loginResponse.body.token)
        .send({ title: 'Who is John Doe anyway?' })
        .expect(400)
      logger.debug('response 1', response1.body)
      logger.debug('response 2', response2.body)
    }
  )

  test('does not allow removing blog post for unauthorized access', async () => {
    const blogToDelete = await Blog.findOne({})
    await request(app)
      .delete(`/api/blogs/${blogToDelete._id}`)
      .expect(401)
  })

  test('allows to delete blog post of same user', async () => {
    const loginResponse = await request(app)
      .post('/api/login')
      .send({ username: 'test', password: 'secret' })
      .expect(200)
    const user = await User.findOne({ username: loginResponse.body.username })
    const blogToDelete = await Blog.findById(user.blogs[0])
    const blogCountBefore = await Blog.countDocuments({})
    await request(app)
      .delete(`/api/blogs/${blogToDelete._id}`)
      .set('Authorization', 'Bearer ' + loginResponse.body.token)
      .expect(204)
    const blogCountAfter = await Blog.countDocuments({})
    expect(blogCountAfter).toBe(blogCountBefore - 1)
    const shouldNotExist = await Blog.findById(blogToDelete._id)
    expect(shouldNotExist).toBeNull()
  })

  test('does not allow to delete blog post of different user', async () => {
    const loginResponse = await request(app)
      .post('/api/login')
      .send({ username: 'test', password: 'secret' })
      .expect(200)
    const user = await User.findOne({ username: 'test2' })
    const blogToDelete = await Blog.findById(user.blogs[0])
    await request(app)
      .delete(`/api/blogs/${blogToDelete._id}`)
      .set('Authorization', 'Bearer ' + loginResponse.body.token)
      .expect(401)
  })

  test('updates blog post', async () => {
    const blogToUpdate = await Blog.findOne({})
    const blogUrl = `/api/blogs/${blogToUpdate._id}`
    const newData = { likes: blogToUpdate.likes + 1 }
    await request(app)
      .put(blogUrl)
      .send(newData)
      .expect(204)
    const blogAfterUpdate = await Blog.findOne({ _id: blogToUpdate._id })
    expect(blogToUpdate.likes).toBe(blogAfterUpdate.likes - 1)
  })
})

afterAll(() => {
  const mongoose = require('mongoose')
  mongoose.connection.close()
})
