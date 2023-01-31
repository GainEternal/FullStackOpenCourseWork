const mongoose = require('mongoose')
const supertest = require('supertest')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

describe('When there are initially some blogs saved', () => {
  let blogsAtStart

  beforeEach(async () => {
    await Blog.deleteMany({})
    await helper.setupInitialBlogs()
    blogsAtStart = await helper.blogsInDb()
  })

  describe('Viewing the bloglist', () => {
    test('returns as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('returns all notes, with id fields correctly transformed', async () => {
      const response = await api.get('/api/blogs')

      expect(response.body).toHaveLength(helper.initialBlogs.length)

      response.body.map((blog) => {
        expect(blog.id).toBeDefined()
      })
    })
  })

  describe('Updating the likes for a blog post', () => {
    test('fails with status code 400 and error message, if id is malformatted', async () => {
      const response = await api.put('/api/blogs/1').expect(400)

      expect(response.body).toEqual({ error: 'malformatted id' })

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toEqual(blogsAtStart)
    })

    test('succeeds with status code 200 if id is valid', async () => {
      const blogsInDb = await helper.blogsInDb()
      const originalBlog = blogsInDb[0]
      const updatedBlog = { ...originalBlog, likes: originalBlog.likes + 1 }

      const response = await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const returnedBlog = response.body
      const blogsAtEnd = await helper.blogsInDb()
      const blogExpectedUpdated = _.find(
        blogsAtEnd,
        (b) => b.id === originalBlog.id,
      )

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      expect(returnedBlog).toEqual({
        ...updatedBlog,
        user: updatedBlog.user.toString(),
      })
      expect(blogExpectedUpdated.likes).toBe(originalBlog.likes + 1)
    })
  })
})

describe('When there are initially some users in the db', () => {
  let usersAtStart

  beforeEach(async () => {
    await User.deleteMany({})
    await helper.setupInitialUsers()
    usersAtStart = await helper.usersInDb()
  })

  test('Viewing the users succeeds and returns all notes with username, name, and id', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialUsers.length)

    const initial_ids = helper.initialUsers.map((user) => user._id)
    response.body.map((user) => {
      expect(Object.keys(user)).toEqual(['username', 'name', 'blogs', 'id'])
      expect(initial_ids).toContainEqual(user.id)
    })
  })

  describe('Creating a user', () => {
    test('succeeds with user returned and user exists in database', async () => {
      const newUser = {
        username: 'Alpha',
        password: 'Beta',
        name: 'Gamma Delta',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(Object.keys(response.body)).toEqual([
        'username',
        'name',
        'blogs',
        'id',
      ])

      const { username: returnedUsername, name: returnedName } = response.body
      expect(returnedUsername).toBe(newUser.username)
      expect(returnedName).toBe(newUser.name)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map((u) => u.username)
      expect(usernames).toContain(newUser.username)
    })

    describe('fails', () => {
      test('with status code 400 if missing body', async () => {
        const response = await api.post('/api/users').expect(400)

        expect(response.body.error).toContain(
          'A new user must have a valid username, password, and name',
        )
      })

      test('when username is shorter than 3 characters', async () => {
        const newUser = {
          username: 'Al',
          password: 'Beta',
          name: 'Gamma Delta',
        }

        const response = await api.post('/api/users').send(newUser).expect(400)

        expect(response.body.error).toContain(
          'is shorter than the minimum allowed length (3)',
        )
      })

      test('when username already exists in db', async () => {
        const newUser = {
          username: 'HidingBug',
          password: 'Beta',
          name: 'Gamma Delta',
        }

        const response = await api.post('/api/users').send(newUser).expect(400)

        expect(response.body.error).toContain(
          'Username already exists. Choose a unique username',
        )
      })

      test('when password is shorter than 3 characters', async () => {
        const newUser = {
          username: 'Alpha',
          password: 'Be',
          name: 'Gamma Delta',
        }

        const response = await api.post('/api/users').send(newUser).expect(400)

        expect(response.body.error).toContain(
          'is shorter than the minimum allowed length (3)',
        )
      })

      afterEach(async () => {
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
      })
    })
  })
})

describe('When there are initially both users and blogs in the db', () => {
  let blogsAtStart

  beforeEach(async () => {
    await helper.setupInitialUsers()

    await helper.setupInitialBlogs()
    blogsAtStart = await helper.blogsInDb()
  })

  test('blogs contain user with username, name, and id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    response.body.map((blog) => {
      expect(Object.keys(blog.user)).toEqual(['username', 'name', 'id'])
      expect(helper.initialUsers.map((user) => user.username)).toContain(
        blog.user.username,
      )
    })
  })

  test('users contain blogs with url, title, author, and id', async () => {
    const userResponse = await api.get('/api/users').expect(200)

    userResponse.body.map((user) => {
      user.blogs.map((blog) => {
        expect(Object.keys(blog)).toEqual(['title', 'author', 'url', 'id'])
        expect(helper.initialBlogs.map((blog) => blog.url)).toContain(blog.url)
      })
    })
  })

  describe('creating a blog', () => {
    let savedUser
    let signedToken
    let newBlog

    beforeEach(async () => {
      savedUser = await User.findOne({ username: 'HidingBug' })
      expect(savedUser.name).toEqual('Fredrick Garfunckle')

      signedToken = jwt.sign(
        { username: savedUser.username, id: savedUser._id },
        process.env.SECRET,
      )

      newBlog = {
        title: '3 Circles',
        author: 'Raymond Vaughn',
        url: 'https://www.youtube.com/watch?v=NYU-a2wIbxc&t=74s&ab_channel=RaymondVaughn',
        likes: 21,
      }
    })

    describe('correctly', () => {
      test('adds blog to list', async () => {
        const response = await api
          .post('/api/blogs')
          .set('authorization', `bearer ${signedToken}`)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        expect(Object.keys(response.body)).toEqual([
          'title',
          'author',
          'url',
          'likes',
          'user',
          'id',
        ])

        const {
          title: returnedTitle,
          author: returnedAuthor,
          url: returnedUrl,
          likes: returnedLikes,
        } = response.body
        expect(returnedTitle).toBe(newBlog.title)
        expect(returnedAuthor).toBe(newBlog.author)
        expect(returnedUrl).toBe(newBlog.url)
        expect(returnedLikes).toBe(newBlog.likes)

        const blogs = await helper.blogsInDb()
        const urls = blogs.map((r) => r.url)

        expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
        expect(urls).toContain(newBlog.url)
      })

      test('with no likes creates blog with likes equal to 0', async () => {
        const newBlogNoLikes = {
          title: '3-2-1: The Story of God, the World, and You',
          author: 'Justin Taylor',
          url: 'https://www.thegospelcoalition.org/blogs/justin-taylor/3-2-1-the-story-of-god-the-world-and-you-a-simple-gospel-explanation/',
        }

        await api
          .post('/api/blogs')
          .set('authorization', `bearer ${signedToken}`)
          .send(newBlogNoLikes)
          .expect(201)

        const blogs = await helper.blogsInDb()
        const pulledNewBlog = _.find(blogs, (b) => b.url === newBlogNoLikes.url)

        expect(pulledNewBlog.likes).toBe(0)
      })

      test('adds user from db to blog, and blog to user', async () => {
        const result = await api
          .post('/api/blogs')
          .set('authorization', `bearer ${signedToken}`)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const savedBlog = result.body

        const blogUser = savedBlog.user
        expect(blogUser).toBe(savedUser._id.toJSON())

        const userHavingBlog = await User.findById(blogUser)
        expect(userHavingBlog.blogs).toHaveLength(5)
        expect(userHavingBlog.blogs[savedUser.blogs.length].toJSON()).toEqual(
          savedBlog.id,
        )
      })
    })

    describe('fails with status code', () => {
      test('400 if missing title', async () => {
        const newBlogNoTitle = {
          author: 'Justin Taylor',
          url: 'https://www.thegospelcoalition.org/blogs/justin-taylor/3-2-1-the-story-of-god-the-world-and-you-a-simple-gospel-explanation/',
        }

        const response = await api
          .post('/api/blogs')
          .set('authorization', `bearer ${signedToken}`)
          .send(newBlogNoTitle)
          .expect(400)

        expect(response.body.error).toContain('`title` is required.')
      })

      test('400 if missing url', async () => {
        const newBlogNoTitle = {
          title: '3-2-1: The Story of God, the World, and You',
          author: 'Justin Taylor',
        }

        const response = await api
          .post('/api/blogs')
          .set('authorization', `bearer ${signedToken}`)
          .send(newBlogNoTitle)
          .expect(400)

        expect(response.body.error).toContain('`url` is required.')
      })

      test('401 if authorization is incorrect', async () => {
        const result = await api
          .post('/api/blogs')
          .set('authorization', ` ${signedToken}`)
          .send(newBlog)
          .expect(401)

        expect(result.body).toEqual({ error: 'token missing or invalid' })
      })

      test('401 if authorization is missing', async () => {
        const result = await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(401)
          .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'token missing or invalid' })
      })

      afterEach(async () => {
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toEqual(blogsAtStart)
      })
    })
  })

  describe('Deleting a single blog post', () => {
    let savedUser
    let signedToken
    let blogToDelete

    beforeEach(async () => {
      savedUser = await User.findOne({ username: 'HidingBug' })
      expect(savedUser.name).toEqual('Fredrick Garfunckle')

      signedToken = jwt.sign(
        { username: savedUser.username, id: savedUser._id },
        process.env.SECRET,
      )

      blogToDelete = helper.initialBlogs[0]._id
    })

    test('succeeds with status code 204 if id is valid', async () => {
      await api
        .delete(`/api/blogs/${blogToDelete}`)
        .set('authorization', `bearer ${signedToken}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const urls = blogsAtEnd.map((b) => b.url)

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
      expect(urls).not.toContain(blogToDelete.url)
    })

    describe('fails with error message', () => {
      test('if blog id is malformatted', async () => {
        const response = await api
          .delete('/api/blogs/1')
          .set('authorization', `bearer ${signedToken}`)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual({ error: 'malformatted id' })

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toEqual(blogsAtStart)
      })

      test('if blog is already deleted', async () => {
        await api
          .delete('/api/blogs/5a422a851b54a676234d17f7')
          .set('authorization', `bearer ${signedToken}`)
          .expect(204)

        await api
          .delete(`/api/blogs/${blogToDelete}`)
          .set('authorization', `bearer ${signedToken}`)
          .expect(404)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtStart.slice(1).sort()).toEqual(blogsAtEnd.sort())
      })

      test('if id is authorization is wrong', async () => {
        const response = await api
          .delete(`/api/blogs/${blogToDelete}`)
          .set('authorization', 'wrong')
          .expect(401)
          .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual({ error: 'token missing or invalid' })

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toEqual(blogsAtStart)
      })

      test('if requesting user did not create blog', async () => {
        const wrongBlogToDelete = helper.initialBlogs[5]._id

        const response = await api
          .delete(`/api/blogs/${wrongBlogToDelete}`)
          .set('authorization', `bearer ${signedToken}`)
          .expect(401)
          .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual({ error: 'token missing or invalid' })

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toEqual(blogsAtStart)
      })
    })
  })
})

describe('Logging in', () => {
  const username = 'Henry'
  const password = 'Kansas'
  const name = 'York'
  let user

  beforeEach(async () => {
    await User.deleteMany({})
    user = new User({
      username,
      passwordHash: await bcrypt.hash(password, 10),
      name,
    })
    await user.save()
  })

  test('returns token, username, and name', async () => {
    const login = {
      username,
      password: password,
    }

    const response = await api
      .post('/api/login')
      .send(login)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const returnedLogin = response.body

    expect(Object.keys(response.body)).toEqual(['token', 'username', 'name'])
    expect(returnedLogin.username).toEqual(username)
    expect(returnedLogin.name).toEqual(name)

    const decoded = jwt.verify(returnedLogin.token, process.env.SECRET)

    expect(decoded.username).toEqual(username)
    expect(decoded.id).toEqual(user._id.toString())
  })

  test('fails, if invalid spassword', async () => {
    const login = {
      username,
      password: 'Wrong',
    }

    const response = await api
      .post('/api/login')
      .send(login)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const returnedLogin = response.body

    expect(returnedLogin.error).toEqual('invalid username or password')
  })

  test('fails, if invalid username', async () => {
    const login = {
      username: 'Wrong',
      password,
    }

    const response = await api
      .post('/api/login')
      .send(login)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const returnedLogin = response.body

    expect(returnedLogin.error).toEqual('invalid username or password')
  })
})

afterAll(() => {
  mongoose.connection.close()
})
