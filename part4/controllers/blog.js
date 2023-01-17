const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})
  
blogRouter.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findOne({})

  const blog = new Blog({
    ...body,
    likes: body.likes || 0,
    user: user._id
  })
  
  const newBlog = await blog.save()
  if (newBlog) {
    response.status(201).json(newBlog)
  } else {
    response.status(400).end()
  }
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)

  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true, context: 'query' }
  )

  response.json(updatedBlog)
})

module.exports = blogRouter