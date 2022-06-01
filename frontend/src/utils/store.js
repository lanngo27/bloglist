import { configureStore } from '@reduxjs/toolkit'
import togglableReducer from '../reducers/togglableReducer'
import notificationReducer from '../reducers/notificationReducer'
import blogReducer from '../reducers/blogReducer'
import userReducer from '../reducers/userReducer'

const store = configureStore({
  reducer: {
    togglable: togglableReducer,
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer
  }
})

export default store
