import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { logout } from '../reducers/loginReducer'
import { notify } from '../reducers/notificationReducer'

class Menu extends React.Component {
  logout = () => {
    this.props.logout()
    this.props.notify('logged out')
  }

  render() {
    const { user } = this.props
    if(user === null) {
      return null
    }
    return(
      <div>
        <NavLink to="/">blogs</NavLink> &nbsp;
        <NavLink to="/users">users</NavLink> &nbsp;
        { user.name} logged in <button onClick={this.logout}>logout</button>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default connect(mapStateToProps,{ logout,notify })(Menu)
