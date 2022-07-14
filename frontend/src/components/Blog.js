import { connect } from 'react-redux'
import { useState } from 'react'
import { Button, Form, ListGroup } from 'react-bootstrap'
import { setNotification } from '../reducers/notificationReducer'
import { updateBlog, addCommentToBlog } from '../reducers/blogReducer'
import { setVisible } from '../reducers/togglableReducer'
import Notification from './Notification'

const Blog = (props) => {
  const blog = props.blog
  const [comment, setComment] = useState('')

  if (!props.blog) return null

  const voteBlog = async (blog) => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1
      }
      props.updateBlog(updatedBlog)
      props.setNotification(
        {
          message: `Updated blog ${blog.title}`,
          error: false
        },
        5000
      )
    } catch (Exception) {
      props.setNotification(
        {
          message: `Can't update blog ${blog.title}`,
          error: true
        },
        5000
      )
    }
  }

  const addComment = async (event) => {
    event.preventDefault()
    try {
      props.addCommentToBlog(blog.id, comment)
      props.setNotification(
        {
          message: `Added a comment for blog ${blog.title}`,
          error: false
        },
        5000
      )
    } catch (Exception) {
      props.setNotification(
        {
          message: `Failed to add comment for blog ${blog.title}`,
          error: true
        },
        5000
      )
    }
  }

  return (
    <div className="p-2">
      <Notification />
      <h3>{blog.title}</h3>
      <p>By: {blog.author}</p>
      {blog.url ? <a href={blog.url}>URL</a> : null}
      <p className="likes">
        {blog.likes} likes{' '}
        <Button
          bg="dark"
          variant="dark"
          onClick={() => voteBlog(blog)}
          className="m-1"
        >
          Like
        </Button>
      </p>
      {blog.user ? <p>Added by {blog.user.name}</p> : null}
      <Form onSubmit={addComment}>
        <Form.Group className="mb-3">
          <Form.Label>Comments</Form.Label>
          <Form.Control
            className="w-50"
            type="text"
            placeholder="Enter comment"
            id="newcomment"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </Form.Group>
        <Button
          id="newcomment-button"
          bg="dark"
          variant="dark"
          onClick={() => props.setVisible('createBlog')}
          className="m-1"
          type="submit"
        >
          Add comment
        </Button>
      </Form>
      <br />
      <ListGroup>
        {blog.comments.map((comm, idx) => (
          <ListGroup.Item
            variant="info"
            as="ul"
            className="border-1 m-0 list-group-item"
            key={idx}
          >
            {comm}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs
  }
}

export default connect(mapStateToProps, {
  setVisible,
  setNotification,
  updateBlog,
  addCommentToBlog
})(Blog)
