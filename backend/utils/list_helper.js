const lodash = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = blogs => {
  if (blogs.length === 0)
    return {}
  const favoriteBlog = blogs.reduce((max, blog) => (max.likes > blog.likes) ? max : blog)
  return { title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }
}

const mostBlogs = blogs => {
  if (blogs.length === 0)
    return {}
  const counts = lodash.countBy(blogs, blog => blog.author)
  const maxAuthor = Object.keys(counts).reduce((max, item) =>
    (counts[max] > counts[item]) ? max : item)
  return { author: maxAuthor, blogs: counts[maxAuthor] }
}

const mostLikes = blogs => {
  if (blogs.length === 0)
    return {}
  const groupedByAuthor = lodash.groupBy(blogs, 'author')
  const totalLikesGroupedByAuthor = Object.keys(groupedByAuthor)
    .map(key => ({
      author: key,
      likes: lodash.sumBy(groupedByAuthor[key], 'likes')
    }))
  return totalLikesGroupedByAuthor
    .reduce((max, item) => (max.likes > item.likes) ? max : item)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}