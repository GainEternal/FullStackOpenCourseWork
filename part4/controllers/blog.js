const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})
  
blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)
  
  const newBlog = blog.save()

  response.status(201).json(newBlog)
})

module.exports = blogRouter