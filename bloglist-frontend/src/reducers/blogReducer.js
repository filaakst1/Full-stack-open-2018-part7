import blogService from '../services/blogs'

const blogReducer = (store = [], action) => {
  console.log('BLOG ACTION: ', action)
  switch(action.type) {
  case 'INIT_BLOG':
    return action.data
  default:
    return store
  }
}
export const blogInitialization = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOG',
      data : blogs
    })
  }
}
export default blogReducer