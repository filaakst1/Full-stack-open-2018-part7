import React from 'react'
import { NavLink } from 'react-router-dom'
const Menu = ({ user, logout }) => {
  return(
    <div>
      <NavLink to="/">blogs</NavLink> &nbsp;
      <NavLink to="/users">users</NavLink> &nbsp;
      { user.name} logged in <button onClick={logout}>logout</button>
    </div>
  )
}
export default Menu