
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}