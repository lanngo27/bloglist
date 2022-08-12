import { IBlog } from '../models/blog'
import { IUser } from '../models/user'

export interface Blog {
  title: string
  author: string
  likes: number
}

export interface AuthorWithMostBlogs {
  author: string
  blogs: number
}

export interface AuthorWithMostLikes {
  author: string
  likes: number
}

export interface TestingBlog {
  title: string
  author: string
  url: string
  likes: number
  user?: string
}

export interface Header {
  Authorization: string
}

export interface NewUser {
  username: string
  name: string
  password?: string
}

export interface UserJSON {
  username: string
  name: string
  blogs: IBlog['_id'][]
}

export interface BlogJSON {
  id: string
  title: string
  author: string
  url: string
  likes: number
  user: IUser['_id']
  comments: string[]
}
