import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import {
  initializeBlogs,
  createBlog,
  deleteBlog,
  incrementLikeOf,
} from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import { setNotification } from './reducers/notificationReducer'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import loginService from './services/login'
import blogService from './services/blogs'

const App = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()
  const {
    blogs,
    user,
    setUser,
    setNotification,
    initializeBlogs,
    createBlog,
    deleteBlog,
    incrementLikeOf,
  } = props

  useEffect(() => {
    initializeBlogs()
  }, [initializeBlogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON && loggedUserJSON !== 'undefined') {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [setUser])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setNotification(error.response.data.error, 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = (blog) => {
    try {
      blogFormRef.current.toggleVisibility()
      createBlog(blog)
      setNotification(`a new blog ${blog.title} added`)
    } catch (error) {
      setNotification(error.response.data.error, 'error')
    }
  }

  const like = (blog) => {
    incrementLikeOf(blog)
    setNotification(`you liked '${blog.title}'`, 5)
  }

  const removeBlog = (blog) => {
    const ok = window.confirm(`Remove ${blog.title} by ${blog.author}`)
    try {
      if (ok) {
        deleteBlog(blog)
        setNotification(`Deleted ${blog.title}`)
      }
    } catch (error) {
      setNotification(error.response.data.error, 'error')
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  )

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name || user.username} logged in
        <button onClick={handleLogout}>logout</button>
        <br />
      </p>
      {blogForm()}
      <ul>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            userId={user.id}
            removeBlog={() => {
              removeBlog(blog)
            }}
            increaseLikes={() => {
              like(blog)
            }}
          />
        ))}
      </ul>
    </div>
  )
}

const mapStateToProps = (state) => ({
  blogs: state.blogs.sort((l, r) => r.likes - l.likes),
  user: state.user,
})

const mapDispatchToProps = {
  setUser,
  setNotification,
  initializeBlogs,
  createBlog,
  deleteBlog,
  incrementLikeOf,
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

export default ConnectedApp
