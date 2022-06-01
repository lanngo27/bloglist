import { Alert } from 'react-bootstrap'
import { connect } from 'react-redux'

const Notification = (props) => {
  if (props.notification === null) return null
  let messageType = 'success'
  if (props.notification.error) {
    messageType = 'danger'
  }

  return (
    <Alert key={messageType} variant={messageType}>
      {props.notification.message}
    </Alert>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}

export default connect(mapStateToProps)(Notification)
