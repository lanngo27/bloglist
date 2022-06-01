import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setVisible } from '../reducers/togglableReducer'
import { Button } from 'react-bootstrap'

const Togglable = (props) => {
  let visible = false
  if (props.type === 'login') visible = props.togglable.loginVisible
  else if (props.type === 'createBlog')
    visible = props.togglable.createBlogVisible

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    props.setVisible(props.type)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button
          bg="dark"
          variant="dark"
          onClick={toggleVisibility}
          className="m-1"
        >
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>{props.children}</div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    togglable: state.togglable
  }
}

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'

export default connect(mapStateToProps, { setVisible })(Togglable)
