const UsersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

UsersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
  })
  response.json(users)
})

UsersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  const existingUser = await User.findOne({ username })

  if (!username || !password || !name) {
    response
      .status(400)
      .json({
        error: 'A new user must have a valid username, password, and name',
      })
  } else if (password && password.length < 3) {
    response
      .status(400)
      .json({
        error: 'The password is shorter than the minimum allowed length (3)',
      })
  } else if (existingUser) {
    response
      .status(400)
      .json({ error: 'Username already exists. Choose a unique username.' })
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      passwordHash,
      name,
    })

    const newUser = await user.save()
    if (newUser) {
      response.status(201).json(newUser)
    } else {
      response.status(400).end()
    }
  }
})

/*
UsersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndRemove(request.params.id)

  response.status(204).end()
})

UsersRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const updatedBlog = await User.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true, context: 'query' }
  )

  response.json(updatedBlog)
}) */

module.exports = UsersRouter
