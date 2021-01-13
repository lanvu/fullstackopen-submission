import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data
    case 'NEW_BLOG':
      return state.concat(action.data)
    case 'DELETE_BLOG': {
      const id = action.data.id
      return state.filter((blog) => blog.id !== id)
    }
    case 'INCREMENT_LIKE': {
      const id = action.data.id
      return state.map((blog) => (blog.id !== id ? blog : action.data))
    }
    default:
      return state
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    })
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog,
    })
  }
}

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    await blogService.remove(blog.id)
    dispatch({
      type: 'DELETE_BLOG',
      data: blog,
    })
  }
}

export const incrementLikeOf = (blog) => {
  return async (dispatch) => {
    const changedBlog = await blogService.update({
      ...blog,
      likes: blog.likes + 1,
    })
    dispatch({
      type: 'INCREMENT_LIKE',
      data: changedBlog,
    })
  }
}

export default blogReducer
