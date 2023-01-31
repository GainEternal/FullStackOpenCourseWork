const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: '5a522a851b54a676234d17f7',
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: '5a522a851b54a676234d17f7',
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: '5a522a851b54a676234d17f7',
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    user: '5a522a851b54a676234d17f7',
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    user: '5a522aa71b54a676234d17f8',
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: '5a522aa71b54a676234d17f8',
    __v: 0,
  },
]

const setupInitialBlogs = async () => {
  await Blog.deleteMany({})
  for (const blog of initialBlogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url: 'www.google.com' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const initialUsers = [
  {
    _id: '5a522a851b54a676234d17f7',
    username: 'HidingBug',
    password: 'UnderRock',
    name: 'Fredrick Garfunckle',
    blogs: [
      '5a422a851b54a676234d17f7',
      '5a422a851b54a676234d17f8',
      '5a422a851b54a676234d17f9',
      '5a422a851b54a676234d17fa',
    ],
    __v: 0,
  },
  {
    _id: '5a522aa71b54a676234d17f8',
    username: 'GiantSquirrel',
    password: 'Flying',
    name: 'Sir Henry Gratias',
    blogs: ['5a422a851b54a676234d17fb', '5a422a851b54a676234d17fc'],
    __v: 0,
  },
]

const setupInitialUsers = async () => {
  await User.deleteMany({})
  const userObjectPromiseArray = initialUsers.map(
    async (user) =>
      new User({
        ...user,
        passwordHash: await bcrypt.hash(user.password, 10),
      }),
  )
  const userObject = await Promise.all(userObjectPromiseArray)
  const promiseArray = userObject.map((user) => user.save())
  await Promise.all(promiseArray)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  initialBlogs,
  setupInitialBlogs,
  blogsInDb,
  nonExistingId,
  initialUsers,
  setupInitialUsers,
  usersInDb,
}
