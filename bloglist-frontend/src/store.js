import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import notificationReducer from './reducers/notificationReducer'
import usersReducer from './reducers/usersReducer'
import loginReducer from './reducers/loginReducer'

const reducer = combineReducers({
  notification: notificationReducer,
  users: usersReducer,
  user : loginReducer
})

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)
console.log('Initial status of store', store.getState())

export default store