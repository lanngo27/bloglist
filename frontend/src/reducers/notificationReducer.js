import { createSlice } from '@reduxjs/toolkit'

let timeoutId

const notificationReducer = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNoti(state, action) {
      return action.payload
    }
  }
})

export const { setNoti } = notificationReducer.actions

export const setNotification = (notification, timeout) => {
  return (dispatch) => {
    clearTimeout(timeoutId)
    dispatch(setNoti(notification))
    timeoutId = setTimeout(() => {
      dispatch(setNoti(null))
    }, timeout)
  }
}

export default notificationReducer.reducer
