import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    }
  }
})

export const { setUser } = userSlice.actions

export const findExistingUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }
}

export const userLogin = ({ username, password }) => {
  return async (dispatch) => {
    const user = await loginService.login({ username, password })
    blogService.setToken(user.token)
    window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
    dispatch(setUser(user))
  }
}

export const userLogout = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedBlogUser')
    dispatch(setUser(null))
  }
}

export default userSlice.reducer
