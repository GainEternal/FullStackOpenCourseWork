const _ = require('lodash')
const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  if (!Array.isArray(blogs) || !blogs.length) {
    return 0
  }
  const total = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  return total
}

const favoriteBlog = (blogs) => {
  if (!Array.isArray(blogs) || !blogs.length) {
    return {}
  }
  const blogWithMostLikes = blogs.reduce((max, current) =>
    current.likes > max.likes ? current : max,
  )
  const blogInfo = (({ title, author, likes }) => ({ title, author, likes }))(
    blogWithMostLikes,
  )
  return blogInfo
}

const mostBlogs = (blogs) => {
  if (!Array.isArray(blogs) || !blogs.length) {
    return {}
  }
  const blogCountsByAuthor = _.countBy(blogs, (blog) => blog.author)
  const maxAuthor = _.maxBy(
    Object.keys(blogCountsByAuthor),
    (o) => blogCountsByAuthor[o],
  )
  const maxAuthorBlogCount = blogCountsByAuthor[maxAuthor]
  return {
    author: maxAuthor,
    blogs: maxAuthorBlogCount,
  }
}

const mostLikes = (blogs) => {
  if (!Array.isArray(blogs) || !blogs.length) {
    return {}
  }
  const blogsByAuthor = _.groupBy(blogs, (blog) => blog.author)
  const likesByAuthor = _.mapValues(blogsByAuthor, (blogs) =>
    _.sumBy(blogs, 'likes'),
  )
  const maxAuthor = _.maxBy(Object.keys(likesByAuthor), (o) => likesByAuthor[o])
  const maxAuthorLikeCount = likesByAuthor[maxAuthor]
  return {
    author: maxAuthor,
    likes: maxAuthorLikeCount,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
