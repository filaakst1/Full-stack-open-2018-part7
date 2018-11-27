const initialState= {
  message: '',
  type: 'info'
}


const notificationReducer = (store = initialState, action) => {
  console.log('NOTIFICATION ACTION: ', action)
  switch(action.type) {
  case 'NOTIFY':
    return {
      message: action.message,
      type: action.messageType
    }
  default:
    return store
  }
}

export const notify = ( message, type = 'info', timeout = 10) => {
  return async (dispatch) => {
    dispatch({
      message : message,
      messageType: type,
      type: 'NOTIFY'
    })
    setTimeout(() => {
      dispatch({
        message : '',
        messageType: 'info',
        type: 'NOTIFY'
      })
    }, timeout*1000)
  }
}

export default notificationReducer