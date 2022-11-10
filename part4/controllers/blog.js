const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})
  
blogRouter.post('/', async (request, response) => {
  const body = request.body
  const blog = new Blog({
    ...body,
    likes: body.likes || 0
  })
  
  const newBlog = await blog.save()
  if (newBlog) {
    response.status(201).json(newBlog)
  } else {
    response.status(400).end()
  }
  
})

module.exports = blogRouter