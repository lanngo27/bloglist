/* eslint-disable indent */
import { createSlice } from '@reduxjs/toolkit'

const togglableSlice = createSlice({
  name: 'togglable',
  initialState: {
    loginVisible: false,
    createBlogVisible: false
  },
  reducers: {
    toggleVisibility(state, action) {
      switch (action.payload) {
        case 'login':
          return { ...state, loginVisible: !state.loginVisible }
        case 'createBlog':
          return { ...state, createBlogVisible: !state.createBlogVisible }
        default:
          return { ...state }
      }
    }
  }
})

export const setVisible = (type) => {
  return (dispatch) => {
    dispatch(toggleVisibility(type))
  }
}

export const { toggleVisibility } = togglableSlice.actions
export default togglableSlice.reducer
