import React from 'react'
import { connect } from 'react-redux'

import { notify } from '../reducers/notificationReducer'
import { login } from '../reducers/loginReducer'

class LoginForm extends React.Component {
  login = async (event) => {
    event.preventDefault()
    try {
      const username = event.target.username.value
      const password = event.target.password.value
      event.target.username.value = ''
      event.target.password.value = ''
      this.props.login(username, password)
      this.notify('welcome back!')
    } catch (exception) {
      this.notify('käyttäjätunnus tai salasana virheellinen', 'error', 5)
    }
  }

  render() {
    return (
      <div>
        <h2>Kirjaudu sovellukseen</h2>
        <form onSubmit={this.login}>
          <div>
            käyttäjätunnus
            <input type="text" name="username" />
          </div>
          <div>
            salasana
            <input type="password" name="password" />
          </div>
          <button type="submit">kirjaudu</button>
        </form>
      </div>
    )
  }
}

export default connect(null,{ login, notify })(LoginForm)
