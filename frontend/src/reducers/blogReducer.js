import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    addBlog(state, action) {
      return state.concat(action.payload)
    },
    update(state, action) {
      const updatedBlog = action.payload
      return state.map((a) => (a.id !== updatedBlog.id ? a : updatedBlog))
    },
    setBlog(state, action) {
      return action.payload
    },
    removeBlog(state, action) {
      return state.filter((a) => a.id !== action.payload)
    },
    addComment(state, action) {
      const updatedBlog = action.payload
      return state.map((a) => (a.id !== updatedBlog.id ? a : updatedBlog))
    }
  }
})

export const { addBlog, update, setBlog, removeBlog, addComment } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlog(blogs))
  }
}

// eslint-disable-next-line no-unused-vars
export const createBlog = (newBlog) => {
  return async (dispatch) => {
    const blog = await blogService.create(newBlog)
    dispatch(addBlog(blog))
  }
}

// eslint-disable-next-line no-unused-vars
export const updateBlog = (blogToUpdate) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update(blogToUpdate)
    dispatch(update(updatedBlog))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.deleteBlog(id)
    dispatch(removeBlog(id))
  }
}

export const addCommentToBlog = (id, comment) => {
  return async (dispatch) => {
    const blog = await blogService.addComment(id, comment)
    dispatch(addComment(blog))
  }
}

export default blogSlice.reducer
