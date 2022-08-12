const lodash = require('lodash')
import { IBlog } from '../models/blog'
import {
  Blog,
  AuthorWithMostBlogs,
  AuthorWithMostLikes
} from '../typings/types'

const totalLikes = (blogs: Array<IBlog>): number => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = (blogs: Array<IBlog>): Blog | {} => {
  if (blogs.length === 0) return {}
  const favoriteBlog: IBlog = blogs.reduce((max, blog) =>
    max.likes > blog.likes ? max : blog
  )
  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }
}

const mostBlogs = (blogs: Array<IBlog>): AuthorWithMostBlogs | {} => {
  if (blogs.length === 0) return {}
  const counts = lodash.countBy(blogs, (blog: IBlog) => blog.author)
  const maxAuthor = Object.keys(counts).reduce((max, item) =>
    counts[max] > counts[item] ? max : item
  )
  return { author: maxAuthor, blogs: counts[maxAuthor] }
}

const mostLikes = (blogs: Array<IBlog>): AuthorWithMostLikes | {} => {
  if (blogs.length === 0) return {}
  const groupedByAuthor = lodash.groupBy(blogs, 'author')
  const totalLikesGroupedByAuthor = Object.keys(groupedByAuthor).map((key) => ({
    author: key,
    likes: lodash.sumBy(groupedByAuthor[key], 'likes')
  }))
  return totalLikesGroupedByAuthor.reduce((max, item) =>
    max.likes > item.likes ? max : item
  )
}

export default {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
