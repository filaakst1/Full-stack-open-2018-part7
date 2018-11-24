import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const reducer = combineReducers({
})
const store = createStore(
  reducer,
  applyMiddleware(thunk)
)
console.log('Initial status of store', store.getState())

export default store