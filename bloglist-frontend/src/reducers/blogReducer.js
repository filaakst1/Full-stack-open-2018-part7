import blogService from '../services/blogs'

const blogReducer = (store = [], action) => {
  console.log('BLOG ACTION: ', action)
  switch(action.type) {
  case 'INIT_BLOG':
    return action.data
  case 'LIKE_BLOG':
    return store.map(b => b._id === action.id ? action.data : b)
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
export const likeBlog = (id) => {
  return async (dispatch, getState) => {
    const state = getState()
    const liked = state.blogs.find(b => b._id===id)
    const updated = { ...liked, likes: liked.likes + 1 }
    await blogService.update(id, updated)
    dispatch({
      type: 'LIKE_BLOG',
      data : updated,
      id: id
    })
    dispatch({
      message : `you liked '${updated.title}' by ${updated.author}`,
      messageType: 'info',
      type: 'NOTIFY'
    })
    setTimeout(() => {
      dispatch({
        message : '',
        messageType: 'info',
        type: 'NOTIFY'
      })
    }, 10000)
  }
}
export default blogReducer