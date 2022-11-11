const mongoose = require('mongoose')
const supertest = require('supertest')
const _ = require('lodash')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObject = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObject.map(note => note.save())
  await Promise.all(promiseArray)
})

describe('When there are initially some blogs saved', () => {

  test('blogList is returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
})

describe('When viewing a blog', () => {
  test('the id fields are correctly transformed', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })
})
  
describe('Creating a new blog', () => {

  test('adds blog to list', async () => {
    const newBlog = {
      title: '3 Circles',
      author: 'Raymond Vaughn',
      url: 'https://www.youtube.com/watch?v=NYU-a2wIbxc&t=74s&ab_channel=RaymondVaughn',
      likes: 21,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    const urls = blogs.map( r => r.url)

    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
    expect(urls).toContain(newBlog.url)
  })

  test('with no likes creates blog with likes equal to 0', async () => {
    const newBlogNoLikes = {
      title: '3-2-1: The Story of God, the World, and You',
      author: 'Justin Taylor',
      url: 'https://www.thegospelcoalition.org/blogs/justin-taylor/3-2-1-the-story-of-god-the-world-and-you-a-simple-gospel-explanation/'
    }    

    await api
      .post('/api/blogs')
      .send(newBlogNoLikes)

    const blogs = await helper.blogsInDb()
    const pulledNewBlog = _.find(blogs, (b) => (b.url === newBlogNoLikes.url))

    expect(pulledNewBlog.likes).toBe(0)
  })
  
  test('fails with status code 400 if missing title', async () => {
    const newBlogNoTitle = {
      author: 'Justin Taylor',
      url: 'https://www.thegospelcoalition.org/blogs/justin-taylor/3-2-1-the-story-of-god-the-world-and-you-a-simple-gospel-explanation/'
    }    

    await api
      .post('/api/blogs')
      .send(newBlogNoTitle)
      .expect(400)
  })

  test('fails with status code 400 if missing url', async () => {
    const newBlogNoTitle = {
      title: '3-2-1: The Story of God, the World, and You',
      author: 'Justin Taylor',
    }    

    await api
      .post('/api/blogs')
      .send(newBlogNoTitle)
      .expect(400)
  })
})

describe.only('Deleting a single blog post', () => {

  test('fails with status code 400 if blank id', async () => {
    await api
      .delete('/api/blogs')
      .expect(400)
    
    await api
      .delete('/api/blogs/')
      .expect(400)
  })

  test('fails with status code 400 if id does not exist', async () => {
    await api
      .delete('/api/blogs/1')
      .expect(400)
  })

  test('')
})



afterAll(() => {
  mongoose.connection.close()
})