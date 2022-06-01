import { connect } from 'react-redux'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { setNotification } from '../reducers/notificationReducer'
import { userLogin } from '../reducers/userReducer'
import Notification from './Notification'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      await props.userLogin({ username, password })
      nav('/')
    } catch (Exception) {
      props.setNotification(
        {
          message: Exception.response.data.error,
          error: true
        },
        5000
      )
    }
  }

  return (
    <div className="gradient-custom d-flex justify-content-center align-items-center h-100">
      <Form onSubmit={handleLogin} className="login-container p-5">
        <h3>Log in </h3>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            className="w-100"
            id="username"
            type="text"
            name="Username"
            value={username}
            placeholder="Enter username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            className="w-100"
            id="password"
            type="password"
            name="password"
            value={password}
            placeholder="Enter password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>
        <Button
          id="login-button"
          type="submit"
          variant="dark"
          className="btn btn-outline-light btn-lg px-5 mt-2"
        >
          Sign in
        </Button>
        <p className="pt-5">
          Not registered yet? <Link to="/signup">Sign up</Link>
        </p>
        <Notification />
      </Form>
    </div>
  )
}

export default connect(null, {
  setNotification,
  userLogin
})(LoginForm)
