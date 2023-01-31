const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', middleware.tokenExtractor, async (request, response) => {
  const decodedToken = await jwt.verify(request.token, process.env.SECRET)

  const user = await User.findById(decodedToken.id)

  const body = request.body
  const blog = new Blog({
    ...body,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  if (savedBlog) {
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } else {
    response.status(400).end()
  }
})

blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = await jwt.verify(request.token, process.env.SECRET)

  const user = await User.findById(decodedToken.id)

  const blogToDelete = await Blog.findById(request.params.id)
  if (!blogToDelete) {
    return response.status(404).end()
  }

  if (blogToDelete.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).send({ error: 'token missing or invalid' })
  }
})

blogRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true, context: 'query' },
  )

  response.json(updatedBlog)
})

module.exports = blogRouter
