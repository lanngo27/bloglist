import { connect } from 'react-redux'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { Link } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap'
import { setNotification } from '../reducers/notificationReducer'
import { createBlog, updateBlog, deleteBlog } from '../reducers/blogReducer'
import { setVisible } from '../reducers/togglableReducer'

const BlogList = (props) => {
  const blogs = [...props.blogs]

  const addBlog = async ({ title, author, url }) => {
    try {
      props.createBlog({ title, author, url })
      props.setNotification(
        {
          message: `A new blog ${title} by ${author} added`,
          error: false
        },
        5000
      )
      props.setVisible('createBlog')
    } catch (Exception) {
      props.setNotification(
        {
          message: `New blog can't be added. Error: ${Exception.response.data.error}`,
          error: true
        },
        5000
      )
    }
  }
  /*const removeButtonStyle = {
    background: '#0288d1'
  }

  const deleteBlog = async (blogToDelete) => {
    try {
      if (window.confirm(`Remove blog ${blogToDelete.title}?`)) {
        props.deleteBlog(blogToDelete.id)
        props.setNotification(
          {
            message: `Removed blog ${blogToDelete.title}`,
            error: false
          },
          5000
        )
      }
    } catch (Exception) {
      props.setNotification(
        {
          message: `Can't delete blog ${blogToDelete.title}`,
          error: true
        },
        5000
      )
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }*/

  return (
    <div>
      <Togglable buttonLabel="Create a new blog" type="createBlog">
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <br />
      <ListGroup>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <div key={blog.id}>
              <ListGroup.Item
                action
                variant="light"
                as={Link}
                to={`/blogs/${blog.id}`}
              >
                {blog.title}
              </ListGroup.Item>
            </div>
          ))}
      </ListGroup>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    user: state.user
  }
}

export default connect(mapStateToProps, {
  setVisible,
  setNotification,
  createBlog,
  updateBlog,
  deleteBlog
})(BlogList)
