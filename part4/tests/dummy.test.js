const listHelper = require('../utils/list_helper')


const emptyList = []


const listWithOneBlog = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  }
]

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }  
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('totalLikes', () => {

  test('of empty list', () => {
    expect(listHelper.totalLikes(emptyList)).toBe(0)
  })

  test('of 1 blog', () => {
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(7)
  })

  test('of 6 blogs', () => {
    expect(listHelper.totalLikes(blogs)).toBe(36)
  })
})

describe('favoriteBlog', () => {

  test('of empty list', () => {
    expect(listHelper.favoriteBlog(emptyList)).toEqual({})
  })

  test('of one blog', () => {
    const output = {
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7,
    } 
    expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(output)
  })

  test('of many blogs', () => {
    const output = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    } 
    expect(listHelper.favoriteBlog(blogs)).toEqual(output)
  })
})

describe('mostBlogs', () => {

  test('of empty list', () => {
    expect(listHelper.mostBlogs(emptyList)).toEqual({})
  })

  test('of one blog', () => {
    const output = {
      author: 'Michael Chan',
      blogs: 1,
    } 
    expect(listHelper.mostBlogs(listWithOneBlog)).toEqual(output)
  })

  test('of many blogs', () => {
    const output = {
      author: 'Robert C. Martin',
      blogs: 3,
    } 
    expect(listHelper.mostBlogs(blogs)).toEqual(output)
  })
})

describe('mostLikes', () => {

  test('exists', () => {
    listHelper.mostLikes()
  })

  test('of empty list', () => {
    expect(listHelper.mostLikes(emptyList)).toEqual({})
  })

  test('of one blog', () => {
    const output = {
      author: 'Michael Chan',
      likes: 7
    }
    expect(listHelper.mostLikes(listWithOneBlog)).toEqual(output)
  })

  test('of many blogs', () => {
    const output = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
    expect(listHelper.mostLikes(blogs)).toEqual(output)
  })
})