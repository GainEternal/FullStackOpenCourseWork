const UsersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

/* UsersRouter.get('/', async (request, response) => {
  const blogs = await User.find({})
  response.json(blogs)
}) */

UsersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.status(200).json(users)
})
  
UsersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  if (username && password && name) {

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
  else {
    response.status(400).end()
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