import React from 'react'
import { connect } from 'react-redux'

class Notification extends React.Component {
  render() {
    const { notification } = this.props

    if (notification === null ||  notification.message.length === 0 ) {
      return null
    }
    return (
      <div className={notification.type }>
        {notification.message}
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}
export default connect(mapStateToProps)(Notification)
