import React from 'react'
import { connect } from 'react-redux'

import { notify } from '../reducers/notificationReducer'
import { login } from '../reducers/loginReducer'

import { Button, FormControl,FormGroup,ControlLabel, } from 'react-bootstrap'


class LoginForm extends React.Component {
  login = async (event) => {
    event.preventDefault()
    try {
      const username = event.target.username.value
      const password = event.target.password.value
      event.target.username.value = ''
      event.target.password.value = ''
      this.props.login(username, password)
      this.props.notify('welcome back!')
    } catch (exception) {
      this.notify('käyttäjätunnus tai salasana virheellinen', 'error', 5)
    }
  }

  render() {
    return (
      <div>
        <h2>Kirjaudu sovellukseen</h2>

        <form onSubmit={this.login}>
          <FormGroup >
            <ControlLabel>käyttäjätunnus</ControlLabel>
            <FormControl type='text' name='username' />
            <ControlLabel>salasana</ControlLabel>
            <FormControl type='password' name='password' />
          </FormGroup>
          <Button bsStyle='success' type='submit'>kirjaudu</Button>
        </form>
      </div>
    )
  }
}

export default connect(null,{ login, notify })(LoginForm)
