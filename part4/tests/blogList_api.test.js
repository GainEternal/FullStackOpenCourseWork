const mongoose = require('mongoose')
const supertest = require('supertest')
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

describe('Blog HTTP GET request', () => {

  test('blogList is returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are six notes', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(6)
  })

  test('when blogList is returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })
})



describe('blog HTTP POST request', () => {
  

  test('returns expected header', async () => {
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

    const response = await api.get('/api/blogs')
    const urls = response.body.map( r => r.url)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(urls).toContain('https://www.youtube.com/watch?v=NYU-a2wIbxc&t=74s&ab_channel=RaymondVaughn')
  })

  /* test('creates new blog', () => {

  }) */
})



afterAll(() => {
  mongoose.connection.close()
})