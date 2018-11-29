import React from 'react'
import { connect } from 'react-redux'
import { logout } from '../reducers/loginReducer'
import { notify } from '../reducers/notificationReducer'

import {  Nav, Navbar, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'




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
        <Navbar inverse  >
          <Navbar.Header>
            <Navbar.Brand>Blog app</Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav bsStyle="pills" >
              <LinkContainer to='/' >
                <NavItem>blogs</NavItem>
              </LinkContainer>
              <LinkContainer to='/users' >
                <NavItem>users</NavItem>
              </LinkContainer>
            </Nav>
            <Nav>
              <NavItem disabled >
                { user.name} logged in
              </NavItem>
              <NavItem eventKey='1' onClick={this.logout} >logout</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

      </div>
    )
  }
}

/*
<Nav pullRight>
              <Navbar.Text>{ user.name} logged in </Navbar.Text><Button bsStyle="primary" onClick={this.logout} >logout</Button>
            </Nav>*/
const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default connect(mapStateToProps,{ logout,notify })(Menu)
