import React from 'react'
import { connect } from 'react-redux'
import { Alert } from 'react-bootstrap'

class Notification extends React.Component {
  render() {
    const { notification } = this.props

    if (notification === null ||  notification.message.length === 0 ) {
      return null
    }
    return (
      <Alert bsStyle={notification.type }>
        <p>{notification.message}</p>
      </Alert>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}
export default connect(mapStateToProps)(Notification)
