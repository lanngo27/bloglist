import { connect } from 'react-redux'
import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { setNotification } from '../reducers/notificationReducer'
import userService from '../services/users'
import Notification from './Notification'

const SignupForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSignup = async (event) => {
    event.preventDefault()

    try {
      await userService.createUser(name, username, password)
      props.setNotification(
        {
          message: `Created user ${username} successfully!`,
          error: false
        },
        5000
      )
    } catch (Exception) {
      props.setNotification(
        {
          message: Exception.response.data.error,
          error: true
        },
        5000
      )
    }

    setUsername('')
    setPassword('')
    setName('')
  }

  return (
    <div className="gradient-custom d-flex justify-content-center align-items-center h-100">
      <Form onSubmit={handleSignup} className="login-container p-4 p-sm-3">
        <h3>Sign up</h3>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            className="w-100"
            type="text"
            name="name"
            value={name}
            placeholder="Enter your name"
            onChange={({ target }) => setName(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            className="w-100"
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            className="w-100"
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>
        <Button
          id="signup-button"
          type="submit"
          variant="dark"
          className="btn btn-outline-light btn-lg px-5"
        >
          Register
        </Button>
        <p className="text-right">
          Already registered? <Link to="/login">Log in</Link>
        </p>

        <Notification />
      </Form>
    </div>
  )
}

export default connect(null, {
  setNotification
})(SignupForm)
