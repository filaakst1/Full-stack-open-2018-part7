import React from 'react'
import PropTypes from 'prop-types'

import './Notification.css'

const Notification = ({ notification }) => {
  if(notification !== null) {
    const clazz = notification.type === 'error' ? 'notification-error-div' : 'notification-info-div'
    return (
      <div className={clazz} >{notification.message}</div>
    )
  }return (<div></div>)

}
Notification.propTypes = {
  notification: PropTypes.object
}
export default Notification