import userService from '../services/users'

const initialState= {
  message: '',
  type: 'info'
}
const usersReducer = (store = initialState, action) => {
  console.log('USERS ACTION: ', action)
  switch(action.type) {
  case 'INIT_USERS': {
    const users = action.data
    return {
      users
    }
  }
  default:
    return store
  }
}

export const usersInitialization = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch({
      type: 'INIT_USERS',
      data : users
    })
  }
}
export default usersReducer