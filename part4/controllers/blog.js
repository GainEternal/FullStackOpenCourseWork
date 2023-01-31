const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post(
  '/',
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const user = request.user

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
  },
)

blogRouter.delete(
  '/:id',
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const user = request.user

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
  },
)

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
