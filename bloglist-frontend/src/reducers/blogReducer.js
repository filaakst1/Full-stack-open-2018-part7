import blogService from '../services/blogs'

const blogReducer = (store = [], action) => {
  console.log('BLOG ACTION: ', action)
  switch(action.type) {
  case 'INIT_BLOG':
    return action.data
  case 'LIKE_BLOG':
    return store.map(b => b._id === action.id ? action.data : b)
  case 'DELETE_BLOG':
    return store.filter(b => b._id!==action.id)
  case 'ADD_BLOG':
    return store.concat(action.data)
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
  }
}

export const removeBlog = (id) => {
  return async (dispatch, getState) => {
    const state = getState()
    const deleted = state.blogs.find(b => b._id === id)
    await blogService.remove(id)
    dispatch({
      type: 'DELETE_BLOG',
      data : deleted,
      id: id
    })
  }
}
export const addBlog = (title, author, url) => {
  return async (dispatch) => {
    const blog = {
      title: title,
      author: author,
      url: url
    }
    const result = await blogService.create(blog)
    dispatch({
      type: 'ADD_BLOG',
      data : result
    })
  }
}

export default blogReducer