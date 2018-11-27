import loginService from '../services/login'
import blogService from '../services/blogs'

const loginReducer = (store = null, action) => {
  console.log('NOTIFICATION ACTION: ', action)
  switch(action.type) {
  case 'LOGIN_ACTION':
    return action.data
  default:
    return store
  }
}
export const readLocalStorage = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch({
        type: 'LOGIN_ACTION',
        data: user
      })
    }
  }
}
export const login = ( username, password ) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({
        username: username,
        password: password
      })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch({
        type: 'LOGIN_ACTION',
        data: user
      })
    }
    catch (exception) {
      dispatch({
        message : 'käyttäjätunnus tai salasana virheellinen',
        messageType: 'error',
        type: 'NOTIFY'
      })
      setTimeout(() => {
        dispatch({
          message : '',
          messageType: 'info',
          type: 'NOTIFY'
        })
      }, 5000)
    }
  }
}
export const logout = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    dispatch({
      type: 'LOGIN_ACTION',
      data: null
    })
  }
}
export default loginReducer