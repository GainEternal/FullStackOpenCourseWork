const _ = require('lodash')
const dummy = () => {
  return 1
}

const totalLikes = ( blogs ) => {
  if (!Array.isArray(blogs) || !blogs.length) {
    return 0
  }
  const total = blogs.reduce(
    ( sum, blog ) => sum + blog.likes,
    0
  )
  return total
}

const favoriteBlog = ( blogs ) => {
  if (!Array.isArray(blogs) || !blogs.length) {
    return {}
  }
  const blogWithMostLikes = blogs.reduce(
    (max, current) => (current.likes > max.likes) ? current : max 
  )
  const blogInfo = (({ title, author, likes }) => ({ title, author, likes }))(blogWithMostLikes)
  return blogInfo
}

const mostBlogs = ( blogs ) => {
  if (!Array.isArray(blogs) || !blogs.length) {
    return {}
  }
  const blogCountsByAuthor = _.countBy(blogs, (blog) => blog.author) 
  const maxAuthor = _.maxBy(Object.keys(blogCountsByAuthor), o => blogCountsByAuthor[o])
  const maxAuthorBlogCount = blogCountsByAuthor[maxAuthor]
  return {
    author: maxAuthor,
    blogs: maxAuthorBlogCount
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}