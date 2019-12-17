const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
  let data = request.body
  if (data.password.length < 3) {
    const error = {
      name: 'ValidationError',
      message:
        'User validation failed: username: Path `password` is shorter than the minimum allowed length (3).'
    }
    next(error)
    return
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(data.password, saltRounds)
  const user = new User({ ...data, passwordHash })
  try {
    const savedUser = await user.save()
    response.json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
